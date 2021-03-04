import { FieldType, FormFields } from 'formkit';

export type HiddenForm = {
  input: string;
  checkbox: boolean;
  text: string;
}

export const hiddenFormFields:FormFields<HiddenForm> = {
  checkbox: {
    type: FieldType.Toggle,
    value: false,
    label: 'Hide text field'
  },
  input: {
    type: FieldType.Text,
    hidden: values => values.checkbox === true
  },
  text: {
    type: FieldType.Text
  }
};
