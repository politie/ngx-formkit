import { Subject } from 'rxjs';
import { FormValues } from '../../models';
import { IFormFieldBase } from '../form-field-base/form-field-base.model';

export interface IFormFieldState extends IFormFieldBase {
  visibilityChanges$: Subject<boolean>;

  updateFieldState(values: FormValues<any>): void

  updateHiddenState(match: boolean): void

  updateDisabledState(match: boolean): void

  updateRequiredState(match: boolean): void
};
