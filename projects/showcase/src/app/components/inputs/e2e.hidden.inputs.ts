import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type HiddenForm = {
  input: string;
  checkbox: boolean;
  text: string;
}

export const hiddenFormFields:FormFields<HiddenForm> = {
  checkbox: {
    type: FieldType.Toggle,
    control: () => new FormControl(false),
    label: 'Hide text field'
  },
  input: {
    type: FieldType.Text,
    control: () => new FormControl(),
    hidden: values => values.checkbox === true
  },
  text: {
    type: FieldType.Text,
    control: () => new FormControl()
  }
};
