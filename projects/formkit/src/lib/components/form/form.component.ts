import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import {
  FieldType,
  FormEvent,
  FormEventType,
  FormFields,
  FormKitFormFieldListItem,
  FormValues,
  IArrayField,
  IField,
  IGroupField,
  IVisibleField,
  TransformValues
} from '../../models';

import { debounceTime, delay, filter, map, takeUntil } from 'rxjs/operators';
import { createFormGroupFromBlueprint } from '../../helpers';

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
  private afterValueUpdateScheduler$ = new Subject<Partial<T>>();
  private updateByControlWithResetProperty = false;

  constructor(private cd: ChangeDetectorRef) {}

  get initialFormValues() {
    return this.initialValues;
  }

  get scheduler$() {
    return this.afterValueUpdateScheduler$;
  }

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
  create(patch?: Partial<T>) {
    if (this.created) {
      throw new Error('FormKit: Form is already created.');
    }

    /**
     * Check if there's a FormGroup passed in the [form] attribute / @Input()
     */
    if (!this.form || !(this.form instanceof FormGroup)) {
      throw new Error(`FormKit: <formkit-form> has no (valid) FormGroup set in [form] attribute.`);
    }

    /**
     * Check if there are fields set in the [fields] attribute / @Input()
     */
    if (!this.fields || (Object.keys(this.fields).length === 0 && this.fields.constructor === Object)) {
      throw new Error(`FormKit: <formkit-form> has no fields set in [fields] attribute.`);
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
     * If there are values given to patch the form,
     * apply them before the event listeners are set.
     */
    if (patch && typeof patch === 'object') {
      this.form.patchValue(patch);
    }

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
     * Everything done, update the created prop and emit event
     */
    this.created = true;

    /**
     * Run change detection
     */
    this.cd.detectChanges();
  }

  /**
   * Will be called if one of the direct child fields in this form should change the
   * hidden state. A new value will be emitted to this field via the BehaviorSubject field$.
   *
   * @param field object containing the `name` of the field and a boolean indicating if the field
   * should be hidden.
   */
  onFieldVisibilityChange(field: { name: string, hide: boolean }) {
    const index = this.fieldList.findIndex((fieldItem) => fieldItem.name === field.name);

    if (index < 0) {
      console.warn(`FormKit: no matching field found for "${name}" to update visibility.`);

      return;
    }

    /**
     * Emit a new value for the field$ observable
     */
    this.fieldList[index].field$.next({
      ...this.fieldList[index].field$.getValue(),
      ...{ hide: field.hide }
    });
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
    });
  }

  /**
   * Check if the field has the property 'resetFormOnChange' set.
   * If so, listen to the valueChanges observable and call the
   * afterValueUpdateScheduler$ observable.
   */
  private createListenerForFormResetControl(name: Extract<keyof T, string>) {
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
   * Adds all fields to the root FormGroup by using the control() property.
   */
  private addFieldsToFormGroup() {
    for (const name of Object.keys(this.fields) as Extract<keyof T, string>[]) {
      const field: IField<T, any> = this.fields[name] as IField<T, any>;

      /**
       * For each FieldType, assign a FormArray, FormGroup or FormControl to the object
       */
      if (field.type === FieldType.Array) {
        this.form.addControl(name, new FormArray([createFormGroupFromBlueprint(field as IArrayField<any, any>)]));
      } else if (field.type === FieldType.Group) {
        this.form.addControl(name, createFormGroupFromBlueprint(field as IGroupField<any, any>));
      } else {
        this.form.addControl(name, field.control());
      }

      /**
       * We're done if the current field type is FieldType.Hidden, since we don't do anything with this field type other
       * than assigning a FormControl to it.
       */
      if (field.type === FieldType.Hidden) {
        continue;
      }

      /**
       * Set a hide property in each field if it doesn't exist already
       */
      if (!field.hide) {
        field.hide = false;
      }

      /**
       * Create Observable for field definition
       */
      const field$ = new BehaviorSubject<IVisibleField<T, any>>(field);

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
      if (this.root && field.hasOwnProperty('resetFormOnChange') && this.form.controls[name]) {
        this.createListenerForFormResetControl(name);
      }

      /**
       * Add field config into the fields$ array with observables per field config ({ name: string, field$: Observable<IField>>})
       */
      this.fieldList.push({ name, field$ });
    }
  }
}
