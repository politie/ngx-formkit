import { FieldType, FormKitFormConfig, Options } from 'formkit';
import { Validators } from '@angular/forms';

export type LayoutForm = {
  day: number;
  month: Options;
  year: number;
  name: string;
  lastName: string;
}

export const layoutFormConfig: FormKitFormConfig<LayoutForm> = {
  fields: {
    day: {
      type: FieldType.Number,
      resetFormOnChange: true,
      width: 3
    },
    month: {
      type: FieldType.Select,
      value: { id: 'feb', label: 'February' },
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
      validators: [Validators.required, Validators.min(6)],
      width: 4
    },
    name: {
      type: FieldType.Text,
      validators: [Validators.required, Validators.maxLength(14)],
      width: 6
    },
    lastName: {
      type: FieldType.Text,
      width: 6
    }
  }
};
