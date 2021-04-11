import { Subject } from 'rxjs';
import { FieldMessage, FieldMessageType, FormValues, IVisibleField } from '../../models';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { IFieldMessagesService } from './field-messages.service.model';
import { Injectable } from '@angular/core';

/**
 * Since NgPackagr will complain about Required (which exists in Typescript), we add
 * the @dynamic decorator right here to let the build --prod pass.
 */
// @dynamic
@Injectable()
export class FieldMessagesService implements IFieldMessagesService {
  public list$ = new Subject<FieldMessage[]>();

  updateVisibleMessages(
    control: AbstractControl,
    field: IVisibleField<any, any, any>,
    values: FormValues<any>,
    defaultMessages: { [key: string]: string | ((error: any) => string) }
  ) {

    let messages: FieldMessage[] = [];

    /**
     * Loop through the default error messages and set them
     */
    if (control.errors && control.touched) {
      for (const error of Object.keys(control.errors).filter(s => defaultMessages[s])) {
        const message = defaultMessages[error];

        messages.push({
          type: FieldMessageType.Error,
          text: (typeof message === 'string') ? message : message(control.errors[error])
        });
      }
    }

    /**
     * Payload for the show function parameter
     */
    const payload = {
      control: control as FormControl | FormArray | FormGroup,
      errors: control.errors || {},
      values
    };

    if (field.messages) {
      messages = [
        ...messages,
        ...field.messages
          .filter(message => {
            if (typeof message.show === 'function') {
              return message.show(payload);
            } else {
              return (message.show);
            }
          })
          .map(message => ({
            type: message.type || FieldMessageType.Information,
            text: (typeof message.text === 'string') ? message.text : message.text(payload)
          }))
      ];
    }

    /**
     * Emit a new value to the messagesSubject$ Subject
     */
    this.list$.next(messages);
  }
}
