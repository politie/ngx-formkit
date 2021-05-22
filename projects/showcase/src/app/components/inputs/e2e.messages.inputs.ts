import { FieldMessageType, FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type MessagesForm = {
  input: string;
  input2: string;
}

export const messagesFormConfig: FormKitFormConfig<MessagesForm> = {
  fields: {
    input2: {
      type: FieldType.Text
    },
    input: {
      type: FieldType.Text,
      messages: (payload) => ([
        {
          show: Boolean(!payload.values.input),
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
  }
};
