import { ReplaySubject } from 'rxjs';
import { FieldMessage, FieldMessageType } from '../../models';
import { IFieldMessagesService, UpdateVisibleMessagesPayload } from './field-messages.service.model';
import { Injectable } from '@angular/core';

/**
 * Since NgPackagr will complain about Required (which exists in Typescript), we add
 * the @dynamic decorator right here to let the build --prod pass.
 */
// @dynamic
@Injectable()
export class FieldMessagesService implements IFieldMessagesService {
  public list$ = new ReplaySubject<FieldMessage[]>(1);

  updateVisibleMessages(payload: UpdateVisibleMessagesPayload) {

    let messages: FieldMessage[] = [];

    /**
     * Loop through the default error messages and set them
     */
    if (payload.control.errors && payload.control.touched) {
      for (const error of Object.keys(payload.control.errors).filter(s => payload.defaultMessages[s])) {
        const message = payload.defaultMessages[error];

        messages.push({
          type: FieldMessageType.Error,
          text: (typeof message === 'string') ? message : message(payload.control.errors[error])
        });
      }
    }

    /**
     * Payload for the show function parameter
     */
    const callbackPayload = { control: payload.control, errors: payload.control.errors || {}, values: payload.values};

    if (payload.field.messages) {
      messages = [
        ...messages,
        ...payload.field.messages(callbackPayload)
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
