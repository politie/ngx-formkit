import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import {
  FieldType,
  FormEvent,
  FormEventType,
  FormKitForm,
  FormValues,
  IAbstractControl,
  IConfig,
  IField,
  IFormGroup,
  ISingleField,
  TransformValues
} from '../../models';

import { debounceTime, delay, filter, map, takeUntil } from 'rxjs/operators';

import { ArrayFieldComponent } from '../array-field/array-field.component';
import { CheckboxFieldComponent } from '../checkbox-field/checkbox-field.component';
import { GroupFieldComponent } from '../group-field/group-field.component';
import { HiddenFieldComponent } from '../hidden-field/hidden-field.component';
import { PasswordFieldComponent } from '../password-field/password-field.component';
import { RadioButtonsFieldComponent } from '../radio-buttons-field/radio-buttons-field.component';
import { RadioFieldComponent } from '../radio-field/radio-field.component';
import { SelectFieldComponent } from '../select-field/select-field.component';
import { TextareaFieldComponent } from '../textarea-field/textarea-field.component';
import { TextFieldComponent } from '../text-field/text-field.component';
import { merge as mergeHelper } from '../../helpers/merge.helpers';

@Component({
  selector: 'formkit-form',
  templateUrl: './form.component.html'
})
export class FormComponent<T> implements OnInit, OnDestroy {
  @Input() form!: FormKitForm<T>;
  @Output() ngSubmit = new EventEmitter<void>();

  value$!: Observable<Partial<T>>;

  destroy$ = new Subject<boolean>();
  root: IFormGroup<T> = new FormGroup({}) as IFormGroup<T>;

  config!: Required<IConfig<T>>;

  private initialValues!: T;
  private firstUpdateCycle = true;
  private afterValueUpdateScheduler$ = new Subject<Partial<T>>();
  private updateByControlWithResetProperty = false;

  private defaultFormConfig: IConfig<T> = {
    components: {
      [FieldType.Password]: PasswordFieldComponent,
      [FieldType.Hidden]: HiddenFieldComponent,
      [FieldType.Radio]: RadioFieldComponent,
      [FieldType.RadioButton]: RadioButtonsFieldComponent,
      [FieldType.Select]: SelectFieldComponent,
      [FieldType.Text]: TextFieldComponent,
      [FieldType.Textarea]: TextareaFieldComponent,
      [FieldType.Checkbox]: CheckboxFieldComponent,
      [FieldType.Array]: ArrayFieldComponent,
      [FieldType.Group]: GroupFieldComponent
    },
    events$: new Subject<FormEvent>(),
    fields: {},
    readonly: false,
    text: {
      loading: 'Loading'
    }
  };

  constructor(private cd: ChangeDetectorRef) {}

  get fields() {
    return this.config.fields;
  }

  get events$(): Subject<FormEvent> {
    return this.config.events$;
  }

  ngOnInit(): void {
    /**
     * Merge the given form configuration with the default configuration and store it
     */
    this.config = mergeHelper(
      this.defaultFormConfig,
      (this.form as unknown as IConfig<T>)
    ) as Required<IConfig<T>>;

    this.addFieldsToRootFormGroup();

    /**
     * Store the initialValues of the form. If the form is reset, these
     * will be the fallback values.
     */
    this.initialValues = this.root.getRawValue();

    /**
     * Set up the AfterValueUpdateScheduler.
     * This scheduler is responsible for emitting events to child FormField components
     */
    this.setupAfterValueUpdateScheduler();

    /**
     * Trigger a event emit for the first time checks
     */
    this.afterValueUpdateScheduler$.next(this.root.getRawValue());

    /**
     * Watch form changes and apply the AfterValueChangesChecks on changes
     */
    this.root.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter(() => !this.updateByControlWithResetProperty)
    ).subscribe(() => {
      /**
       * Only update if the update isn't triggered by a control with a resetFormOnChange
       * property (these fields have their own valueChanges listener and will trigger
       * the updateScheduler accordingly.
       */
      this.afterValueUpdateScheduler$.next(this.root.getRawValue());
    });

    this.value$ = this.config.events$.pipe(
      filter(event => event.type === FormEventType.OnAfterUpdateChecks),
      delay(25),
      map(() => this.root.getRawValue())
    );

    this.cd.detectChanges();
  }

  transformValues<K = T>(payload: TransformValues<T, K>) {
    const values: T = this.root.getRawValue();

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

  setValues(values: FormValues<T>) {
    this.root.patchValue(values, { emitEvent: false, onlySelf: true });

    this.config.events$.next({
      type: FormEventType.OnAfterUpdateChecks,
      values: this.root.getRawValue()
    });
  }

  _onSubmitClick() {
    this.ngSubmit.emit();
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
      this.config.events$.next({
        type: (this.firstUpdateCycle) ? FormEventType.OnFirstAfterUpdateChecks : FormEventType.OnAfterUpdateChecks,
        values
      });

      if (this.firstUpdateCycle) {
        this.firstUpdateCycle = false;
      }
    });
  }

  /**
   * Adds all fields to the root FormGroup by using the control() property.
   */
  private addFieldsToRootFormGroup() {
    for (const name of Object.keys(this.config.fields) as Extract<keyof T, string>[]) {
      const field: IField<T, any> = this.config.fields[name] as IField<T, any>;

      /**
       * Set a template property in each field if it doesn't exist already
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

        this.root.addControl(
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

        this.root.addControl(name, new FormGroup(obj as {[key: string]: FormControl}));

      } else {
        this.root.addControl(name, field.control());
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
      if (field.hasOwnProperty('resetFormOnChange')) {
        this.root.get(name).valueChanges
          .pipe(
            map(value => ({ [name]: value }) as unknown as FormValues<T>,
            takeUntil(this.destroy$))
          ).subscribe((value: any) => {
            this.updateByControlWithResetProperty = true;
            this.root.reset({ ...this.initialValues, ...value }, { emitEvent: false, onlySelf: true });
            this.afterValueUpdateScheduler$.next(this.root.getRawValue());
          }
        );
      }
    }
  }
}
