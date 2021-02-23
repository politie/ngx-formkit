import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type HiddenForm = {
  input: string;
  checkbox: boolean;
}

export const hiddenFormFields:FormFields<HiddenForm> = {
  input: {
    type: FieldType.Text,
    control: () => new FormControl(),
    hidden: values => values.checkbox === true
  },
  checkbox: {
    type: FieldType.Checkbox,
    control: () => new FormControl(false),
    option: {
      id: 'messages-1',
      label: 'Check to make Textfield hidden'
    }
  }
};
