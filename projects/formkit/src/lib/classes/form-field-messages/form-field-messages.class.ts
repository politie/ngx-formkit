import { Subject } from 'rxjs';
import { FieldMessage, FieldMessageType, FormValues } from '../../models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormFieldBase } from '../form-field-base/form-field-base.class';
import { IFormFieldMessages } from './form-field-messages.model';

export class FormFieldMessages extends FormFieldBase implements IFormFieldMessages {
  public list$ = new Subject<FieldMessage[]>();

  updateVisibleMessages(values: FormValues<any>) {
    if (!this.field.messages) {
      return;
    }

    /**
     * Payload for the show function parameter
     */
    const payload = {
      control: this.control as FormControl | FormArray | FormGroup,
      errors: this.control.errors || {},
      values
    };

    /**
     * Emit a new value to the messagesSubject$ Subject
     */
    this.list$.next(this.field.messages
      .filter(message => {
        if (typeof message.show === 'function') {
          return message.show(payload);
        } else {
          return !!(message.show);
        }
      })
      .map(message => ({
        type: message.type || FieldMessageType.Information,
        text: (typeof message.text === 'string') ? message.text : message.text(payload)
      })));
  }
}
