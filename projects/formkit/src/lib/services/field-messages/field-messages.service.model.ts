import { Subject } from 'rxjs';
import { FieldMessage, FormValues, IVisibleField } from '../../models';
import { AbstractControl } from '@angular/forms';

export interface IFieldMessagesService {
  list$: Subject<FieldMessage[]>;
  updateVisibleMessages(control: AbstractControl, field: IVisibleField<any, any, any>, values: FormValues<any>): void;
}
