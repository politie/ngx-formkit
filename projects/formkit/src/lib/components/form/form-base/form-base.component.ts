import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType, FormFields, FormKitFormFieldListItem, IField, IVisibleField } from '../../../models';
import { BehaviorSubject, Subject } from 'rxjs';
import { IFormBaseComponent } from './form-base.component.model';

@Component({
  template: ''
})
export class FormBaseComponent<T> implements IFormBaseComponent<T>, OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() fields!: FormFields<T>;

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

    for (const name of Object.keys(this.fields) as Extract<keyof T, string>[]) {
      this.processSingleFieldDefinition(name, this.fields[name] as IField<T, any, any>);
    }
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

  processSingleFieldDefinition(name: Extract<keyof T, string>, field: IField<T, any, any>) {
    if (field.type === FieldType.Hidden) {
      return;
    }

    if (!field.hide) {
      field.hide = false;
    }

    this.fieldList.push({
      name,
      field$: new BehaviorSubject<IVisibleField<T, any, any>>(field)
    });
  }
}
