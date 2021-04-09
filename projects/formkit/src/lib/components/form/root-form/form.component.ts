import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject, timer } from 'rxjs';

import {
  FieldType,
  FormEventType,
  FormKitModuleConfig,
  FormUpdateType, IArrayField,
  IField, IGroupField,
  TransformValues
} from '../../../models';

import { debounce, delay, filter, map, takeUntil, tap } from 'rxjs/operators';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../../config/config.token';
import { FormService } from '../../../services/form.service';
import { FormBaseComponent } from '../form-base/form-base.component';
import { IFormComponent } from './form.component.model';
import { FormArray } from '@angular/forms';
import { createFormControl, formGroupFromBlueprint } from '../../../helpers';

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
export class FormComponent<T> extends FormBaseComponent<T> implements IFormComponent<T>, OnInit, OnDestroy {
  @Input() readonly = false;

  formUpdateType: FormUpdateType = FormUpdateType.Init;

  readonly afterValueUpdateScheduler$ = new Subject<void>();
  private initialValues!: T;

  constructor(
    private cd: ChangeDetectorRef,
    private formService: FormService,
    @Inject(FORMKIT_MODULE_CONFIG_TOKEN) private config: Required<FormKitModuleConfig>
  ) {
    super();
  }

  get initialFormValues() {
    return this.initialValues;
  }

  get scheduler$() {
    return this.afterValueUpdateScheduler$;
  }

  get value$() {
    return this.formService.formEvents$.pipe(
      filter(event => event.type === FormEventType.OnAfterUpdateChecks),
      delay(25),
      map(() => this.form.getRawValue()),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    /**
     * Store the initialValues of the form. If the form is reset, these
     * will be the fallback values.
     */
    this.initialValues = this.form.getRawValue();

    /**
     * Set up the AfterValueUpdateScheduler.
     * This scheduler is responsible for emitting events to child FormField components
     */
    this.setupAfterValueUpdateScheduler();

    /**
     * Trigger a event emit for the first time checks
     */
    this.afterValueUpdateScheduler$.next();

    /**
     * Watch form changes and apply the AfterValueChangesChecks on changes.
     * Only update if the update isn't triggered by a control with a resetFormOnChange
     * property (these fields have their own valueChanges listener and will trigger
     * the updateScheduler accordingly.
     */
    merge(
      this.formService.fieldEvents$.pipe(
        filter(() => this.formUpdateType === FormUpdateType.User),
        map(event => event.values),
        tap(values => {
          this.formUpdateType = FormUpdateType.Reset;
          this.form.reset({ ...this.initialValues, ...values }, { emitEvent: false, onlySelf: true });
        })
      ),
      this.form.valueChanges.pipe(
        filter(() => this.formUpdateType !== FormUpdateType.Reset)
      )
    ).pipe(takeUntil(this.destroy$)).subscribe(() => this.afterValueUpdateScheduler$.next());

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
    this.form.patchValue(patch, { onlySelf: false, emitEvent: false });
    this.afterValueUpdateScheduler$.next();
  }

  /**
   * Adds a subscription to the global afterValueUpdateScheduler$ observable with some delay.
   */
  setupAfterValueUpdateScheduler() {
    if (this.created) {
      return;
    }

    this.afterValueUpdateScheduler$.pipe(
      debounce(() => timer((this.formUpdateType === FormUpdateType.User) ? Math.min(Math.max(10, 2500), this.config.updateDebounceTime) : 0)),
      map(() => this.form.getRawValue()),
      takeUntil(this.destroy$)
    ).subscribe(values => {
        this.formUpdateType = FormUpdateType.User;
        /**
         * For the first update cycle, we emit a FirstUpdateComplete Event, so
         * that Fields can run a OnInit Hook.
         */
        this.formService.triggerFormUpdateChecks(values);
    });
  }

  /**
   * Call the base processSingleFieldDefinition and add controls for each field (only in root)
   *
   * @param name the current field name
   * @param field definition for this field
   */
  processSingleFieldDefinition(name: Extract<keyof T, string>, field: IField<T, any, any>) {
    super.processSingleFieldDefinition(name, field);

    if (field.type === FieldType.Array) {
      this.form.addControl(name, new FormArray([formGroupFromBlueprint(field as IArrayField<any, any, any>)]));
    } else if (field.type === FieldType.Group) {
      this.form.addControl(name, formGroupFromBlueprint(field as IGroupField<any, any, any>));
    } else {
      this.form.addControl(name, createFormControl(field.value, field.validators));
    }
  }
}
