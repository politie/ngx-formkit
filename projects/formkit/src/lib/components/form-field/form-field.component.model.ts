import { FieldMessageType, FieldType, FormValues } from '../../models';
import { IFieldBaseDirective } from '../../directives/field-base/field-base.directive.model';

export interface IFormFieldComponent extends IFieldBaseDirective {
  FieldType: typeof FieldType;
  FieldMessageType: typeof FieldMessageType;

  renderFieldComponent(): void
}
