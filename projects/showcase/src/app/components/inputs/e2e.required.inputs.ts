import { FieldMessageType, FieldType, FormFields } from 'formkit';

export type RequiredForm = {
  input: string;
  checkbox: boolean;
}

export const requiredFormFields: FormFields<RequiredForm> = {
  input: {
    type: FieldType.Text,
    required: values => values.checkbox === true,
    messages: [
      {
        show: ({ values, control }) => control.errors?.required,
        text: 'This field is required.',
        type: FieldMessageType.Error
      }
    ]
  },
  checkbox: {
    type: FieldType.Checkbox,
    option: {
      id: 'basic-1',
      label: 'Check to make Textfield required'
    }
  }
};
