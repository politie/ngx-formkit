import { IFormBaseComponent } from './form-base/form-base.component.model';
import { FormUpdateType, TransformValues } from '../../models';
import { Observable, Subject } from 'rxjs';

export interface IFormComponent<T> extends IFormBaseComponent<T> {
  formUpdateType: FormUpdateType;
  value$: Observable<Partial<T>>;
  initialFormValues: T;
  scheduler$: Subject<void>;

  patch(patch: Partial<T>): void

  transformValues<K = T>(payload: TransformValues<T, K>): void

  setupAfterValueUpdateScheduler(): void
}
