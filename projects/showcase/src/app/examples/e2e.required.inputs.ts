import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';
import { Validators } from '@angular/forms';

export type RequiredForm = {
  email: string;
  checkbox: boolean;
}

export const requiredFormConfig: FormKitFormConfig<RequiredForm> = {
  fields: {
    checkbox: {
      type: FieldType.Toggle,
      value: false,
      label: 'Toggle required text field'
    },
    email: {
      type: FieldType.Email,
      header: {
        title: 'Email',
        description: 'This field is only required if the toggle is set to active.'
      },
      validators: [Validators.email],
      status: ({values}) => ({
        required: values.checkbox
      })
    }
  }
};
