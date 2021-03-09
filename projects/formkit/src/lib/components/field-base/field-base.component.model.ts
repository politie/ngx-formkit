import { Subject } from 'rxjs';

export interface IFieldBaseComponent {
  destroy$: Subject<boolean>;
}
