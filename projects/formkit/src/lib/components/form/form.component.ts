import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef
} from '@angular/core';
import { merge, Observable, Subject, timer } from 'rxjs';

import {
  FieldType,
  FormKitFormConfig,
  FormKitModuleConfig,
  FormUpdateType,
  FormValueTransformFunction,
  IField,
  IRepeatableField
} from '../../models';

import { debounce, filter, map, share, takeUntil, tap } from 'rxjs/operators';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../config/config.token';
import { FormService } from '../../services/form.service';
import { IFormComponent } from './form.component.model';
import { FormArray, FormGroup } from '@angular/forms';
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
  @Input() fieldsTemplate!: TemplateRef<any>;

  @Input() form!: FormGroup;
  @Input() config!: FormKitFormConfig<T>;

  created = false;
  destroy$ = new Subject<boolean>();
  formUpdateType: FormUpdateType = FormUpdateType.Init;

  public transformedValues$!: Observable<T>;

  private initialValues!: T;
  private valueChanges$!: Observable<T>;
  private fieldResetWatcher$!: Observable<T>;

  constructor(
    private cd: ChangeDetectorRef,
    public formService: FormService,
    @Inject(FORMKIT_MODULE_CONFIG_TOKEN) private moduleConfig: Required<FormKitModuleConfig>
  ) { }

  get initialFormValues() {
    return this.initialValues;
  }

  get value$() {
    return this.transformedValues$;
  }

  runSuppliedInputsChecks() {
    if (this.created) {
      throw new Error('FormKit: Form is already created.');
    }

    /**
     * Check if there's a FormGroup passed in the [form] attribute / @Input()
     */
    if (!this.form || !(this.form instanceof FormGroup)) {
      throw new Error(`FormKit: <formkit-form> has no (valid) FormGroup set in [form] attribute.`);
    }

    if (!this.config || (Object.keys(this.config).length === 0 && this.config.constructor === Object)) {
      throw new Error(`FormKit: <formkit-form> has no config set in [config] attribute.`);
    }

    /**
     * Check if there are fields set in the [fields] attribute / @Input()
     */
    if (!this.config.fields || (Object.keys(this.config.fields).length === 0 && this.config.fields.constructor === Object)) {
      throw new Error(`FormKit: <formkit-form> has no fields set in the [config] attribute.`);
    }
  }

  ngOnInit(): void {
    this.runSuppliedInputsChecks();

    for (const name of Object.keys(this.config.fields) as Extract<keyof T, string>[]) {
      this.processSingleFieldDefinition(name, this.config.fields[name] as IField<T, any, any>);
    }

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
      this.formService.triggerFormUpdateChecks(values);
    });

    /**
     * We should wait one tick before we trigger the updateChecks
     * in order for the CD cycle to handle conditional properties in the FormGroup and FormControls work properly
     */
    setTimeout(() => this.formService.triggerFormUpdateChecks(this.form.getRawValue()));

    /**
     * Everything done, update the created prop and emit event
     */
    this.created = true;

    /**
     * Run change detection
     */
    this.cd.markForCheck();
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

  transformFormValuesByFormTransformFunction(currentValues: T): T {
    const result: Partial<T> = (this.config.transforms as FormValueTransformFunction<T>)(currentValues) as Partial<T>;

    if (!utilities.isEmptyObject(result)) {
      for (const field of (Object.keys(result) as Extract<keyof T, string>[]).filter(key => typeof result[key] !== 'undefined')) {
        const control = this.form.controls[field];
        control.setValue((control instanceof FormArray) ? [result[field]]: result[field], { onlySelf: true, emitEvent: false });
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
  processSingleFieldDefinition(name: Extract<keyof T, string>, field: IField<T, any, any>) {
    if (field.type === FieldType.Repeatable) {
      this.form.addControl(name, new FormArray([formGroupFromBlueprint(field as IRepeatableField<any, any, any>)]));
    } else {
      this.form.addControl(name, createFormControl(field.value, field.validators));
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
