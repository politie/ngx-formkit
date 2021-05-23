import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Observable, Subject, timer } from 'rxjs';

import {
  FieldType,
  FormKitFormConfig,
  FormKitModuleConfig,
  FormUpdateType,
  FormValueTransformFunction,
  IField,
  IRepeatableField,
  IVisibleField
} from '../../models';

import { debounce, filter, map, share, takeUntil, tap, throttle } from 'rxjs/operators';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../config/config.token';
import { FormService } from '../../services/form.service';
import { IFormComponent } from './form.component.model';
import { AbstractControlOptions, FormArray, FormGroup } from '@angular/forms';
import { createFormControl, formGroupFromBlueprint, utilities } from '../../helpers';

/**
 * Since NgPackagr will complain about Required (which exists in Typescript), we add
 * the @dynamic decorator right here to let the build --prod pass.
 */
// @dynamic
@Component({
  selector: 'formkit-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FormService
  ]
})
export class FormComponent<T> implements IFormComponent<T>, OnInit, OnDestroy {
  @Input() readonly = false;
  @Input() config!: FormKitFormConfig<T>;
  @Input() form!: FormGroup;
  created = false;

  public transformedValues$!: Observable<T>;
  public submitAttempt$: Observable<boolean>;

  private destroy$ = new Subject<boolean>();
  private formUpdateType: FormUpdateType = FormUpdateType.Init;
  private initialValues!: T;
  private valueChanges$!: Observable<T>;
  private fieldResetWatcher$!: Observable<T>;
  private submitSubject$ = new Subject<boolean>();

  constructor(
    private cd: ChangeDetectorRef,
    public formService: FormService,
    @Inject(FORMKIT_MODULE_CONFIG_TOKEN) private moduleConfig: Required<FormKitModuleConfig>
  ) {
    this.submitAttempt$ = this.submitSubject$.asObservable();
  }

  get value$() {
    return this.transformedValues$;
  }

  ngOnInit(): void {
    this.runSuppliedInputsChecks();

    if (this.readonly) {
      this.form.disable({ emitEvent: false });
    }

    for (const name of Object.keys(this.config.fields) as Extract<keyof T, string>[]) {
      this.processSingleFieldDefinition(name, this.config.fields[name] as IField<T, any, any>);
    }

    this.create();
  }

  /**
   * You can use the trigger update function to trigger a update of all fields.
   * Normally, all fields will update on every change in the form.
   */
  triggerUpdateChecks(values: T | null = null): void {
    this.formService.triggerFormUpdateChecks(values ?? this.form.getRawValue());
  }

  /**
   * Use the patch property to reliably patch the form with new values.
   * This is useful if you have a field with `resetFormOnChange` properties
   * set in your fields definition.
   *
   * @param patch the values to use for patching
   */
  patch(patch: Partial<T>) {
    this.formUpdateType = FormUpdateType.Patch;
    this.form.patchValue(patch, { onlySelf: false, emitEvent: true });
  }

  reset() {
    this.form.patchValue(this.initialValues, { onlySelf: false, emitEvent: true });
  }

  /**
   * On submit, trigger the submitted$ observable. If the form isn't valid
   * and a form message is present, this will be displayed.
   */
  onSubmitClick(): boolean {
    this.form.markAllAsTouched();
    this.submitSubject$.next(true);

    return this.form.valid;
  }

  trackByFn(index: number, name: string) {
    return name;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  private runSuppliedInputsChecks() {
    if (this.created) {
      this.throwError(`Form is already created.`);
    }

    if (!this.form || !(this.form instanceof FormGroup)) {
      this.throwError(`<formkit-form> has no FormGroup set in [form] attribute.`);
    }

    if (!this.config || (Object.keys(this.config).length === 0 && this.config.constructor === Object)) {
      this.throwError(`<formkit-form> has no config set in [config] attribute.`);
    }

    if (!this.config.fields || (Object.keys(this.config.fields).length === 0 && this.config.fields.constructor === Object)) {
      this.throwError(`<formkit-form> has no fields set in [config] attribute.`);
    }
  }

  private create(): void {
    /**
     * Store the initialValues of the form. If the form is reset, these
     * will be the fallback values.
     */
    this.initialValues = this.form.getRawValue();

    /* Add a few observables to keep an eye on the different streams of data */
    this.valueChanges$ = this.form.valueChanges.pipe(
      filter(() => this.formUpdateType !== FormUpdateType.Reset),
      share()
    );

    this.fieldResetWatcher$ = this.formService.fieldEvents$.pipe(
      filter(() => this.formUpdateType === FormUpdateType.User),
      map(event => event.values as T),
      tap(values => {
        this.formUpdateType = FormUpdateType.Reset;
        this.form.reset({ ...this.initialValues, ...values }, { emitEvent: false, onlySelf: true });
      }),
      share()
    );

    this.transformedValues$ = merge(this.fieldResetWatcher$, this.valueChanges$).pipe(
      debounce(() => timer((this.formUpdateType === FormUpdateType.User) ? Math.min(Math.max(10, 2500), this.moduleConfig.updateDebounceTime) : 0)),
      map(() => (this.config.transforms) ? this.transformFormValuesByFormTransformFunction(this.form.getRawValue()) : this.form.getRawValue()),
      share()
    );

    /**
     * Watch form changes and apply the AfterValueChangesChecks on changes.
     * Only update if the update isn't triggered by a control with a resetFormOnChange
     * property (these fields have their own valueChanges listener and will trigger
     * the updateScheduler accordingly.
     */
    this.transformedValues$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(values => {
      this.formUpdateType = FormUpdateType.User;
      this.submitSubject$.next(false);
      this.triggerUpdateChecks(values);
    });

    /**
     * We should wait one tick before we trigger the updateChecks
     * in order for the CD cycle to handle conditional properties in the FormGroup and FormControls work properly
     */
    setTimeout(() => this.triggerUpdateChecks());

    /**
     * Everything done, update the created prop and emit event
     */
    this.created = true;

    /**
     * Run change detection
     */
    this.cd.markForCheck();
  }

  private transformFormValuesByFormTransformFunction(currentValues: T): T {
    const transforms: Partial<T> = (this.config.transforms as FormValueTransformFunction<T>)(currentValues) as Partial<T>;

    if (!utilities.isEmptyObject(transforms)) {
      for (const key of (Object.keys(transforms) as Extract<keyof T, string>[]).filter(k => typeof transforms[k] !== 'undefined')) {

        const control = this.form.controls[key];
        const field = this.config.fields[key] as IVisibleField<any, any, any>;

        if (!control || !field) {
          continue;
        }

        if (field.type === FieldType.Repeatable) {
          control.setValue([transforms[key]], { onlySelf: true, emitEvent: false });
        } else {
          control.setValue(transforms[key], { onlySelf: true, emitEvent: false });
        }
      }

      return this.form.getRawValue();
    }

    return currentValues;
  }

  /**
   * Call the base processSingleFieldDefinition and add controls for each field (only in root)
   *
   * @param name the current field name
   * @param field definition for this field
   */
  private processSingleFieldDefinition(name: Extract<keyof T, string>, field: IField<T, any, any>) {
    if (field.type === FieldType.Repeatable) {
      this.form.addControl(
        name,
        new FormArray([formGroupFromBlueprint(field as IRepeatableField<any, any, any>)], {
          updateOn: field.updateOn || 'change'
        })
      );
    } else {
      const options: AbstractControlOptions = {
        validators: field.validators,
        updateOn: field.updateOn || 'change'
      };

      if (field.type === FieldType.Checkbox && field.hasOwnProperty('options')) {
        if (field.value && !Array.isArray(field.value)) {
          this.throwError('Trying to add multiple checkboxes with a default value that is not of type Array.', name);
        }
        this.form.addControl(name, createFormControl(field.value || [], options));
      } else {
        this.form.addControl(name, createFormControl(field.value, options));
      }
    }
  }

  private throwError(message: string, fieldName?: string) {
    throw new Error(`FormKit - ${fieldName ? 'Error in config for field with key ' + fieldName + ': ' : ''}${message}`);
  }
}
