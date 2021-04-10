import { Subject } from 'rxjs';
import { FieldMessage, FormValues } from '../../models';
import { IFormFieldBase } from '../form-field-base/form-field-base.model';

export interface IFormFieldMessages extends IFormFieldBase {
  list$: Subject<FieldMessage[]>;

  updateVisibleMessages(values: FormValues<any>): void
}
