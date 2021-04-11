import { FormUpdateType, IField } from '../../models';
import { Observable, Subject } from 'rxjs';

export interface IFormComponent<T> {
  formUpdateType: FormUpdateType;
  value$: Observable<Partial<T>>;
  initialFormValues: T;
  scheduler$: Subject<void>;
  created: boolean;
  destroy$: Subject<boolean>;

  runSuppliedInputsChecks(): void

  processSingleFieldDefinition(name: Extract<keyof T, string>, field: IField<T, any, any>): void

  patch(patch: Partial<T>): void

  setupAfterValueUpdateScheduler(): void
}
