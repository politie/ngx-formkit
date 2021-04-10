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
  fieldList: Extract<keyof T, string>[] = [];

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

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  processSingleFieldDefinition(name: Extract<keyof T, string>, field: IField<T, any, any>) {
    if (field.type === FieldType.Hidden) {
      return;
    }

    this.fieldList.push(name);
  }
}
