import { FormKitFormFieldListItem, IField } from '../../../models';
import { Subject } from 'rxjs';

export interface IFormBaseComponent<T> {
  created: boolean;
  destroy$: Subject<boolean>;
  fieldList: FormKitFormFieldListItem<T>[];

  runSuppliedInputsChecks(): void

  processSingleFieldDefinition(name: Extract<keyof T, string>, field: IField<T, any>): void

  onFieldVisibilityChange(field: { name: string, hide: boolean }): void
}
