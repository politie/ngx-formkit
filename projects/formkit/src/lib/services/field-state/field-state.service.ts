import { Subject } from 'rxjs';
import { FormValues, IVisibleField } from '../../models';
import { mergeError, removeError } from '../../helpers';
import { AbstractControl, Validators } from '@angular/forms';
import { IFieldStateService } from './field-state.service.model';
import { Injectable } from '@angular/core';

@Injectable()
export class FieldStateService implements IFieldStateService {
  public visibilityChanges$ = new Subject<boolean>();

  updateFieldState(control: AbstractControl, field: IVisibleField<any, any, any>, values: FormValues<any>) {
    if (field.hidden) {
      this.updateHiddenState(typeof field.hidden === 'boolean' ? field.hidden : field.hidden(values));
    }

    if (field.disabled) {
      this.updateDisabledState(control, typeof field.disabled === 'boolean' ? field.disabled : field.disabled(values));
    }

    if (field.required) {
      this.updateRequiredState(control, typeof field.required === 'boolean' ? field.required : field.required(values));
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
