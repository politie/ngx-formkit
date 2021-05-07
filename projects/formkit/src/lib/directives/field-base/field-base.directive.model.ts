import { Subject } from 'rxjs';

export interface IFieldBaseDirective {
  destroy$: Subject<boolean>;
}
