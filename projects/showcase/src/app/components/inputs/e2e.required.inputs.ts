import { FieldType, FormFields } from 'formkit';
import { Validators } from '@angular/forms';

export type RequiredForm = {
  input: string;
  checkbox: boolean;
}

export const requiredFormFields: FormFields<RequiredForm> = {
  input: {
    type: FieldType.Text,
    validators: [Validators.email],
    status: ({ values }) => ({
      required: values.checkbox
    })
  },
  checkbox: {
    type: FieldType.Checkbox,
    option: {
      id: 'basic-1',
      label: 'Check to make Textfield required'
    }
  }
};
