import { ReplaySubject } from 'rxjs';
import { FieldMessage, FormValues, IVisibleField } from '../../models';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export type UpdateVisibleMessagesPayload = {
  control: AbstractControl | FormControl | FormArray | FormGroup;
  field: IVisibleField<any, any, any>;
  values: FormValues<any>;
  defaultMessages: { [key: string]: string | ((error: any) => string) };
};

export interface IFieldMessagesService {
  list$: ReplaySubject<FieldMessage[]>;
  updateVisibleMessages(payload: UpdateVisibleMessagesPayload): void;
}
