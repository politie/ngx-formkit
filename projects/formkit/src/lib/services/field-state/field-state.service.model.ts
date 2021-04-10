import { Subject } from 'rxjs';
import { FormValues, IVisibleField } from '../../models';
import { AbstractControl } from '@angular/forms';

export interface IFieldStateService {
  visibilityChanges$: Subject<boolean>;

  updateFieldState(control: AbstractControl, field: IVisibleField<any, any, any>, values: FormValues<any>): void

  updateHiddenState(match: boolean): void

  updateDisabledState(control: AbstractControl, match: boolean): void

  updateRequiredState(control: AbstractControl, match: boolean): void
};
