import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import {
  FieldType,
  FormEvent,
  FormEventType,
  FormFields,
  FormKitFormFieldListItem,
  FormValues,
  IAbstractControl,
  IField,
  ISingleField,
  TransformValues
} from '../../models';

import { debounceTime, delay, filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'formkit-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent<T> implements OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() fields!: FormFields<T>;
  @Input() readonly = false;
  @Input() autoCreate = true;
  @Input() root = true;
  @Input() rootFormEvents$?: Subject<FormEvent>;

  created = false;

  value$!: Observable<Partial<T>>;
  destroy$ = new Subject<boolean>();

  events$!: Subject<FormEvent>;
  fieldList: FormKitFormFieldListItem<T>[] = [];

  private initialValues!: T;
  private firstUpdateCycle = true;
  private afterValueUpdateScheduler$ = new Subject<Partial<T>>();
  private updateByControlWithResetProperty = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    /**
     * Create a FormEvent Subject or hook into the existing if the current form isn't the root instance.
     */
    this.events$ = (this.root) ? new Subject<FormEvent>() : this.rootFormEvents$ as Subject<FormEvent>;

    /**
     * Only call create() if the form isn't created
     */
    if (this.autoCreate && !this.created) {
      this.create();
    }
  }

  /**
   * Create the form and
   */
  create() {
    if (this.created) {
      throw new Error('Form is already created.');
    }

    this.addFieldsToFormGroup();

    /**
     * If the FormKitForm isn't the root form, stop right here.
     */
    if (!this.root) {
      this.created = true;

      return;
    }

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
    this.afterValueUpdateScheduler$.next(this.form.getRawValue());

    /**
     * Watch form changes and apply the AfterValueChangesChecks on changes
     */
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter(() => !this.updateByControlWithResetProperty)
    ).subscribe(() => {
      /**
       * Only update if the update isn't triggered by a control with a resetFormOnChange
       * property (these fields have their own valueChanges listener and will trigger
       * the updateScheduler accordingly.
       */
      this.afterValueUpdateScheduler$.next(this.form.getRawValue());
    });

    /**
     * Hook into the OnAfterUpdateChecks event stream and update the value$ observable value
     */
    this.value$ = this.events$.pipe(
      filter(event => event.type === FormEventType.OnAfterUpdateChecks),
      delay(25),
      map(() => this.form.getRawValue())
    );

    /**
     * Everything done, update the created prop
     */
    this.created = true;

    /**
     * Run change detection
     */
    this.cd.detectChanges();
  }

  /**
   * Transforms the current set of form values and returns the transformed values.
   *
   * @param payload object with properties:
   * 'omit' for keys to emit from the result
   * 'transform': array with transforms per key
   */
  transformValues<K = T>(payload: TransformValues<T, K>) {
    const values: T = this.form.getRawValue();

    /* Apply transformations and delete original keys */
    if (typeof payload.transform === 'function') {
      const transforms = payload.transform(values);

      for (const transform of transforms) {

        /**
         * Transform the value of 'from' to 'to' without transform
         */
        if (typeof transform.to === 'string') {
          Object.defineProperty(values, transform.to, {
            enumerable: true,
            value: values[transform.from]
          });

          if (transform.to !== transform.from as string) {
            delete values[transform.from];
          }

        } else if (typeof transform.to === 'object') {
          const result = transform.to;
          const key: Extract<keyof K, string> = Object.keys(result)[0] as Extract<keyof K, string>;

          Object.defineProperty(values, key, {
            enumerable: true,
            value: result[key]
          });

          if (key as string !== transform.from) {
            delete values[transform.from];
          }
        }
      }
    }

    /**
     *  Do the omit as last, so we can transform keys first
     */
    if (payload.omit) {
      for (const key of payload.omit) {
        delete values[key];
      }
    }

    return values;
  }

  /**
   * Update form values by given values. The values
   * are patched, which means that there won't be any errors
   * when values are missing for controls in the FormGroup.
   *
   * @param values Set of values to patch the FormGroup with.
   */
  setValues(values: FormValues<T>) {
    this.form.patchValue(values, { emitEvent: false, onlySelf: true });

    this.events$.next({
      type: FormEventType.OnAfterUpdateChecks,
      values: this.form.getRawValue()
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  /**
   * Adds a subscription to the global afterValueUpdateScheduler$ observable with some delay.
   */
  private setupAfterValueUpdateScheduler() {
    this.afterValueUpdateScheduler$.pipe(debounceTime(10), takeUntil(this.destroy$)).subscribe(values => {

      /**
       * If this change is triggered by a Field with the resetFormOnChange,
       * reset the updateByControlWithResetProperty for the next update round.
       */
      if (this.updateByControlWithResetProperty) {
        this.updateByControlWithResetProperty = false;
      }

      /**
       * For the first update cycle, we emit a FirstUpdateComplete Event, so
       * that Fields can run a OnInit Hook.
       */
      this.events$.next({ type: FormEventType.OnAfterUpdateChecks, values });

      if (this.firstUpdateCycle) {
        this.firstUpdateCycle = false;
      }
    });
  }

  /**
   * Adds all fields to the root FormGroup by using the control() property.
   */
  private addFieldsToFormGroup() {
    for (const name of Object.keys(this.fields) as Extract<keyof T, string>[]) {
      const field: IField<T, any> = this.fields[name] as IField<T, any>;

      /**
       * Set a hide property in each field if it doesn't exist already
       */
      if (!field.hide) {
        field.hide = false;
      }

      /**
       * For each FieldType, assign a FormArray, FormGroup or FormControl to the object
       */
      if (field.type === FieldType.Array) {
        const obj: {[key: string]: FormControl} = {};

        for (const key of Object.keys(field.blueprint))  {
          const childField: ISingleField<T, any> = field.blueprint[key];
          obj[key] = childField.control();
        }

        this.form.addControl(
          name,
          new FormArray([
            new FormGroup(obj as {[key: string]: FormControl})
          ]) as IAbstractControl<T>
        );

      } else if (field.type === FieldType.Group) {
        const obj: {[K in Extract<keyof T[any], string>]?: FormControl} = {};

        for (const key of Object.keys(field.blueprint) as Extract<keyof T[any], string>[])  {
          const childField: ISingleField<T, any> = field.blueprint[key] as ISingleField<T, any>;
          obj[key] = childField.control();
        }

        this.form.addControl(name, new FormGroup(obj as {[key: string]: FormControl}));

      } else {
        this.form.addControl(name, field.control());
      }

      /**
       * Check if the field has the property 'resetFormOnChange' set.
       * If so, listen to the valueChanges observable and call the
       * afterValueUpdateScheduler$ observable.
       *
       * When a field with this property set changes, the form is reset
       * to the initial values and the only value that is set is the
       * value of this field. After this, all fields in the form
       * will receive a event to run their after update value checks.
       */
      if (this.root && field.hasOwnProperty('resetFormOnChange')) {

        /**
         * Security check to see if there's a control in the controls object with `name` property
         */
        if (!this.form.controls[name]) {
          return;
        }

        this.form.controls[name].valueChanges
          .pipe(
            map(value => ({ [name]: value }) as unknown as FormValues<T>,
            takeUntil(this.destroy$))
          ).subscribe((value: any) => {
            this.updateByControlWithResetProperty = true;
            this.form.reset({ ...this.initialValues, ...value }, { emitEvent: false, onlySelf: true });
            this.afterValueUpdateScheduler$.next(this.form.getRawValue());
          }
        );
      }

      /**
       * Add field config into the fields$ array with observables per field config ({ name: string, field$: Observable<IField>>})
       */
      this.fieldList.push({ name, field });
    }
  }
}
