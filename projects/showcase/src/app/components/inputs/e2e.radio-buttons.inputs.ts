import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type RadioButtonsForm = {
  radioButton: number;
}

export const radioButtonsFormConfig: FormKitFormConfig<RadioButtonsForm> = {
  fields: {
    radioButton: {
      type: FieldType.RadioButton,
      value: 2,
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
