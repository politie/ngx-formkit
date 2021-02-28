import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type DateForm = {
  date: string;
}

export const dateFormFields:FormFields<DateForm> = {
  date: {
    type: FieldType.Date,
    control: () => new FormControl()
  }
};
