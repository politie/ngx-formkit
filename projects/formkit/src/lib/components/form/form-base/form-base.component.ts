import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {
  FieldType,
  FormFields,
  FormKitFormFieldListItem,
  IArrayField,
  IField,
  IGroupField,
  IVisibleField
} from '../../../models';
import { BehaviorSubject, Subject } from 'rxjs';
import { createFormControl, formGroupFromBlueprint } from '../../../helpers';
import { IFormBaseComponent } from './form-base.component.model';

@Component({
  template: ''
})
export class FormBaseComponent<T> implements IFormBaseComponent<T>, OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() fields!: FormFields<T>;
  @Input() readonly = false;
  @Input() root = true;

  created = false;
  destroy$ = new Subject<boolean>();
  fieldList: FormKitFormFieldListItem<T>[] = [];

  constructor() {}

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

    /**
     * Check if there are fields set in the [fields] attribute / @Input()
     */
    if (!this.fields || (Object.keys(this.fields).length === 0 && this.fields.constructor === Object)) {
      throw new Error(`FormKit: <formkit-form> has no fields set in [fields] attribute.`);
    }
  }

  ngOnInit(): void {
    this.runSuppliedInputsChecks();
    this.addFieldsToFormGroup();
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

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  /**
   * Adds all fields to the root FormGroup by using the control() property.
   */
  addFieldsToFormGroup() {
    if (this.created) {
      return;
    }

    for (const name of Object.keys(this.fields) as Extract<keyof T, string>[]) {
      const field: IField<T, any> = this.fields[name] as IField<T, any>;

      /**
       * For each FieldType, assign a FormArray, FormGroup or FormControl to the object
       */
      if (this.root) {
        if (field.type === FieldType.Array) {
          this.form.addControl(name, new FormArray([formGroupFromBlueprint(field as IArrayField<any, any>)]));
        } else if (field.type === FieldType.Group) {
          this.form.addControl(name, formGroupFromBlueprint(field as IGroupField<any, any>));
        } else {
          this.form.addControl(name, createFormControl(field.value, field.validators));
        }
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
       * Add field config into the fields$ array with observables per field config ({ name: string, field$: Observable<IField>>})
       */
      this.fieldList.push({ name, field$ });
    }
  }
}
