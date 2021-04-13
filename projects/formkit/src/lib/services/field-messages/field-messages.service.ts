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
    control: AbstractControl | FormControl | FormArray | FormGroup,
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
    const payload = { control, errors: control.errors || {}, values};

    if (field.messages) {
      messages = [
        ...messages,
        ...field.messages(payload)
          .filter(m => m.show)
          .map(({ type, text }) => ({ type: type ? type : FieldMessageType.Information, text }))
      ];
    }

    /**
     * Emit a new value to the messagesSubject$ Subject
     */
    this.list$.next(messages);
  }
}
