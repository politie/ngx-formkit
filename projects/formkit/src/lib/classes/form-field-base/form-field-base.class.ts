import { AbstractControl } from '@angular/forms';
import { IVisibleField } from '../../models';
import { IFormFieldBase } from './form-field-base.model';

export class FormFieldBase implements IFormFieldBase {
  readonly control: AbstractControl;
  readonly field: IVisibleField<any, any, any>;

  constructor(control: AbstractControl, field: IVisibleField<any, any, any>) {
    this.control = control;
    this.field = field;
  }
}
