import { ReplaySubject } from 'rxjs';
import { FieldMessage, FormValues, IVisibleField } from '../../models';
import { AbstractControl } from '@angular/forms';

export interface IFieldMessagesService {
  list$: ReplaySubject<FieldMessage[]>;
  updateVisibleMessages(
    control: AbstractControl,
    field: IVisibleField<any, any, any>,
    values: FormValues<any>,
    defaultMessages?: { [key: string]: string | ((error: any) => string) }
  ): void;
}
