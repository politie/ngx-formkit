import { Subject } from 'rxjs';
import { FormValues } from '../../models';
import { mergeError, removeError } from '../../helpers';
import { Validators } from '@angular/forms';
import { FormFieldBase } from '../form-field-base/form-field-base.class';
import { IFormFieldState } from './form-field-state.model';

export class FormFieldState extends FormFieldBase implements IFormFieldState {
  public visibilityChanges$ = new Subject<boolean>();

  updateFieldState(values: FormValues<any>) {
    if (this.field.hidden) {
      this.updateHiddenState(typeof this.field.hidden === 'boolean' ? this.field.hidden : this.field.hidden(values));
    }

    if (this.field.disabled) {
      this.updateDisabledState(typeof this.field.disabled === 'boolean' ? this.field.disabled : this.field.disabled(values));
    }

    if (this.field.required) {
      this.updateRequiredState(typeof this.field.required === 'boolean' ? this.field.required : this.field.required(values));
    }
  }

  updateHiddenState(match: boolean) {
    this.visibilityChanges$.next(match);
  }

  updateDisabledState(match: boolean) {
    if (match && this.control.enabled) {
      this.control.disable({onlySelf: true, emitEvent: false});
    } else if (!match && this.control.disabled) {
      this.control.enable({onlySelf: true, emitEvent: false});
    }
  }

  updateRequiredState(match: boolean) {
    if (match) {
      this.control.setErrors(mergeError(this.control.errors, Validators.required(this.control)));
    } else {
      this.control.setErrors(removeError(this.control.errors, 'required'));
    }
  }
}
