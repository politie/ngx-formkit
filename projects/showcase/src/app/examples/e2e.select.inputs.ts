import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';
import { Validators } from '@angular/forms';

export type SelectForm = {
  select: any;
}

export const selectFormConfig: FormKitFormConfig<SelectForm> = {
  fields: {
    select: {
      type: FieldType.Select,
      validators: [Validators.required],
      value: null,
      placeholder: 'Choose...',
      options: [
        {
          id: 1,
          label: 'Label 1',
          description: 'Description 1'
        },
        {
          id: 2,
          label: 'Label 2',
          description: 'Description 2'
        }
      ]
    }
  }
};
