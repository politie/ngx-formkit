import { IVisibleField } from '../../models';
import { AbstractControl } from '@angular/forms';

export interface IFormFieldBase {
  readonly control: AbstractControl;
  readonly field: IVisibleField<any, any, any>;
}
