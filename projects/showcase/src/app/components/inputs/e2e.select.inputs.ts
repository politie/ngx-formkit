import { FieldType, FormFields } from 'formkit';

export type SelectForm = {
  select: any;
}

export const selectFormFields: FormFields<SelectForm> = {
  select: {
    type: FieldType.Select,
    value: {
      id: 1,
      label: 'Label 1',
      description: 'Description 1'
    },
    label: 'Select an option',
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
};
