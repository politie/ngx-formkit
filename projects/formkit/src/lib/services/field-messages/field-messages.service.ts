import { Subject } from 'rxjs';
import { FieldMessage, FieldMessageType, FormValues, IVisibleField } from '../../models';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { IFieldMessagesService } from './field-messages.service.model';
import { Injectable } from '@angular/core';

@Injectable()
export class FieldMessagesService implements IFieldMessagesService {
  public list$ = new Subject<FieldMessage[]>();

  updateVisibleMessages(control: AbstractControl, field: IVisibleField<any, any, any>, values: FormValues<any>) {
    if (!field.messages) {
      return;
    }

    /**
     * Payload for the show function parameter
     */
    const payload = {
      control: control as FormControl | FormArray | FormGroup,
      errors: control.errors || {},
      values
    };

    /**
     * Emit a new value to the messagesSubject$ Subject
     */
    this.list$.next(field.messages
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
