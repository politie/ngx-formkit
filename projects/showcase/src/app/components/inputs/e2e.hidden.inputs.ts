import { FieldType, FormFields } from 'formkit';

export type HiddenForm = {
  input: string;
  checkbox: boolean;
  text: string;
}

export const hiddenFormFields:FormFields<HiddenForm> = {
  checkbox: {
    type: FieldType.Checkbox,
    value: false,
    option: {
      id: true,
      label: 'Hide text field'
    }
  },
  input: {
    type: FieldType.Text,
    status: ({ values }) => ({
      hidden: values.checkbox
    })
  },
  text: {
    type: FieldType.Text
  }
};
