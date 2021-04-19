import { FieldType, FormKitFormConfig } from 'formkit';

export type SelectForm = {
  select: any;
}

export const selectFormConfig: FormKitFormConfig<SelectForm> = {
  fields: {
    select: {
      type: FieldType.Select,
      value: {
        id: 1,
        label: 'Label 1',
        description: 'Description 1'
      },
      placeholder: 'Select an option',
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
