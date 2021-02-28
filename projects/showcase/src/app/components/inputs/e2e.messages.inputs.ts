import { FieldMessageType, FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type MessagesForm = {
  input: string;
}

export const messagesFormFields: FormFields<MessagesForm> = {
  input: {
    type: FieldType.Text,
    control: () => new FormControl(),
    messages: [
      {
        type: FieldMessageType.Information,
        text: 'This message will show if the field is empty',
        show: ({ control }) => !control.value || control.value === ''
      },
      {
        type: FieldMessageType.Information,
        text: ({ control }) => `You have entered ${control.value.length} characters.`,
        show: ({ control }) => control.value
      }
    ]
  }
};
