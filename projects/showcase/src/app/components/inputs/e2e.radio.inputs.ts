import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type RadioForm = {
  radio: number;
}

export const radioFormConfig: FormKitFormConfig<RadioForm> = {
  fields: {
    radio: {
      type: FieldType.Radio,
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
