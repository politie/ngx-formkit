import { FormKitFormFieldListItem, FormUpdateType } from '../../../models';
import { Observable, Subject } from 'rxjs';

export interface IFormBaseComponent<T> {
  created: boolean;
  destroy$: Subject<boolean>;
  fieldList: FormKitFormFieldListItem<T>[];

  runSuppliedInputsChecks(): void

  /**
   * Will be called if one of the direct child fields in this form should change the
   * hidden state. A new value will be emitted to this field via the BehaviorSubject field$.
   *
   * @param field object containing the `name` of the field and a boolean indicating if the field
   * should be hidden.
   */
  onFieldVisibilityChange(field: { name: string, hide: boolean }): void

  /**
   * Adds all fields to the root FormGroup by using the control() property.
   */
  addFieldsToFormGroup(): void
}
