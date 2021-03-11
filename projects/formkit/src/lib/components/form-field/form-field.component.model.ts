import { FieldMessage, FieldMessageType, FieldType, FormValues } from '../../models';
import { IFieldBaseComponent } from '../field-base/field-base.component.model';
import { Observable } from 'rxjs';

export interface IFormFieldComponent extends IFieldBaseComponent {
  messages$: Observable<FieldMessage[]>;
  FieldType: typeof FieldType;
  FieldMessageType: typeof FieldMessageType;

  renderFieldComponent(): void

  setupResetListener(): void

  setupFormEventListener(): void

  setupOneTimeFormControlEventListener(): void

  onAfterUpdateChecks(values: FormValues<any>): void

  updateHiddenState(match: boolean): void

  updateDisabledState(match: boolean): void

  updateRequiredState(match: boolean): void

  updateMessages(values: FormValues<any>): void
}
