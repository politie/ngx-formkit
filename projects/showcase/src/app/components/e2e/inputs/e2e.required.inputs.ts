import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type RequiredForm = {
  input: string;
  checkbox: boolean;
}

export const requiredFormFields: FormFields<RequiredForm> = {
  input: {
    type: FieldType.Text,
    control: () => new FormControl(),
    required: values => values.checkbox === true
  },
  checkbox: {
    type: FieldType.Checkbox,
    control: () => new FormControl(false),
    option: {
      id: 'basic-1',
      label: 'Check to make Textfield required'
    }
  }
};
