import { FieldMessageType, FieldType, FormFields } from 'formkit';

export type MessagesForm = {
  input: string;
}

export const messagesFormFields: FormFields<MessagesForm> = {
  input: {
    type: FieldType.Text,
    messages: (payload) => ([
      {
        show: !payload.control.value || payload.control.value === '',
        type: FieldMessageType.Information,
        text: 'This message will show if the field is empty'
      },
      {
        show: Boolean(payload.control.value),
        type: FieldMessageType.Information,
        text: `You have entered ${payload.control.value?.length} characters.`
      }
    ])
  }
};
