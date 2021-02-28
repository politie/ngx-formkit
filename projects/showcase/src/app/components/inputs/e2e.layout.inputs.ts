import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type LayoutForm = {
  day: number;
  month: number;
  year: number;
  name: string;
  lastName: string;
}

export const layoutFormFields: FormFields<LayoutForm> = {
  day: {
    type: FieldType.Number,
    control: () => new FormControl(null),
    width: 3
  },
  month: {
    type: FieldType.Select,
    control: () => new FormControl(),
    width: 5,
    options: [
      {
        id: 'jan',
        label: 'January'
      },
      {
        id: 'feb',
        label: 'February'
      },
      {
        id: 'mar',
        label: 'March'
      }
    ]
  },
  year: {
    type: FieldType.Number,
    control: () => new FormControl(null),
    width: 4
  },
  name: {
    type: FieldType.Text,
    control: () => new FormControl(null),
    width: 6
  },
  lastName: {
    type: FieldType.Text,
    control: () => new FormControl(null),
    width: 6
  }
};
