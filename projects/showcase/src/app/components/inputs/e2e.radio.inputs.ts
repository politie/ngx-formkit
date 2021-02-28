import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type RadioForm = {
  radio: number;
}

export const radioFormFields: FormFields<RadioForm> = {
  radio: {
    type: FieldType.Radio,
    control: () => new FormControl(2),
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
