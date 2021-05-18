import { Observable, Subject } from 'rxjs';

export interface IFormComponent<T> {
  value$: Observable<Partial<T>>;
  created: boolean;

  patch(patch: Partial<T>): void

  triggerUpdateChecks(values: T | null): void

  onSubmitClick(): boolean
}
