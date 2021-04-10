import { FieldMessageType, FieldType, FormValues } from '../../models';
import { IFieldBaseComponent } from '../field-base/field-base.component.model';

export interface IFormFieldComponent extends IFieldBaseComponent {
  FieldType: typeof FieldType;
  FieldMessageType: typeof FieldMessageType;

  renderFieldComponent(): void

  setupResetListener(): void

  setupFormEventListener(): void

  setupOneTimeFormControlEventListener(): void

  onAfterUpdateChecks(values: FormValues<any>): void
}
