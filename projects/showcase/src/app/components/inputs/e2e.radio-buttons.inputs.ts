import { FieldType, FormFields } from 'formkit';

export type RadioButtonsForm = {
  radioButton: number;
}

export const radioButtonsFormFields: FormFields<RadioButtonsForm> = {
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
  },
};
