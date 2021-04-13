import { Subject } from 'rxjs';
import { FormValues, IVisibleField } from '../../models';
import { mergeError, removeError } from '../../helpers';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IFieldStateService } from './field-state.service.model';
import { Injectable } from '@angular/core';

@Injectable()
export class FieldStateService implements IFieldStateService {
  public visibilityChanges$ = new Subject<boolean>();

  updateFieldState(control: AbstractControl | FormControl | FormArray | FormGroup, field: IVisibleField<any, any, any>, values: FormValues<any>) {

    if (field.status && typeof field.status === 'function') {
      const result = field.status({ control, errors: control.errors || {}, values });

      if (typeof result.hidden !== 'undefined') {
        this.updateHiddenState(result.hidden);
      }

      if (typeof result.disabled !== 'undefined') {
        this.updateDisabledState(control, result.disabled);
      }

      if (typeof result.required !== 'undefined') {
        this.updateRequiredState(control, result.required);
      }
    }
  }

  updateHiddenState(match: boolean) {
    this.visibilityChanges$.next(match);
  }

  updateDisabledState(control: AbstractControl, match: boolean) {
    if (match && control.enabled) {
      control.disable({onlySelf: true, emitEvent: false});
    } else if (!match && control.disabled) {
      control.enable({onlySelf: true, emitEvent: false});
    }
  }

  updateRequiredState(control: AbstractControl, match: boolean) {
    if (match) {
      control.setErrors(mergeError(control.errors, Validators.required(control)));
    } else {
      control.setErrors(removeError(control.errors, 'required'));
    }
  }
}
