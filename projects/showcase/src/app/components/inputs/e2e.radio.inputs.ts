import { FieldType, FormFields } from 'formkit';

export type RadioForm = {
  radio: number;
}

export const radioFormFields: FormFields<RadioForm> = {
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
  },
};
