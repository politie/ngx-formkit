import { FieldType, FormFields } from 'formkit';

export type SelectForm = {
  select: any;
  selectMultiple: any[];
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
  },

  selectMultiple: {
    type: FieldType.Select,
    value: [{
      id: 1,
      label: 'Label 1',
      description: 'Description 1'
    }],
    label: 'Select an option',
    multiple: true,
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
      },
      {
        id: 3,
        label: 'Label 3',
        description: 'Description 3'
      }
    ]
  }
};
