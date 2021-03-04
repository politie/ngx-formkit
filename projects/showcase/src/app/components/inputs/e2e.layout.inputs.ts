import { FieldType, FormFields } from 'formkit';

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
    width: 3
  },
  month: {
    type: FieldType.Select,
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
    width: 4
  },
  name: {
    type: FieldType.Text,
    width: 6
  },
  lastName: {
    type: FieldType.Text,
    width: 6
  }
};
