import { FieldMessageType, FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type MessagesForm = {
  input: string;
  checkbox: boolean;
}

export const messagesFormFields: FormFields<MessagesForm> = {
  input: {
    type: FieldType.Text,
    control: () => new FormControl(),
    required: values => values.checkbox === true,
    messages: [
      {
        type: FieldMessageType.Information,
        text: 'This message will always show',
        show: true
      },
      {
        type: FieldMessageType.Error,
        text: 'This field is required',
        show: payload => payload.control.errors?.required
      },
      {
        type: FieldMessageType.Information,
        text: 'This message shows if input value equals `test`',
        show: payload => payload.control.value === 'test'
      }
    ]
  },
  checkbox: {
    type: FieldType.Checkbox,
    control: () => new FormControl(false),
    option: {
      id: 'messages-1',
      label: 'Check to make Textfield required'
    }
  }
};
