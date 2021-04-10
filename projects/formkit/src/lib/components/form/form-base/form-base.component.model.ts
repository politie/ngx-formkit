import { IField } from '../../../models';
import { Subject } from 'rxjs';

export interface IFormBaseComponent<T> {
  created: boolean;
  destroy$: Subject<boolean>;
  fieldList: Extract<keyof T, string>[];

  runSuppliedInputsChecks(): void

  processSingleFieldDefinition(name: Extract<keyof T, string>, field: IField<T, any, any>): void
}
