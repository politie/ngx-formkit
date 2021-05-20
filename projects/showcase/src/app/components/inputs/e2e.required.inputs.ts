import { FieldType, FormKitFormConfig } from 'formkit';
import { Validators } from '@angular/forms';

export type RequiredForm = {
  input: string;
  checkbox: boolean;
}

export const requiredFormConfig: FormKitFormConfig<RequiredForm> = {
  fields: {
    input: {
      type: FieldType.Text,
      validators: [Validators.email],
      status: ({values}) => ({
        required: values.checkbox
      })
    },
    checkbox: {
      type: FieldType.Checkbox,
      label: 'Toggle required text field'
    }
  }
};
