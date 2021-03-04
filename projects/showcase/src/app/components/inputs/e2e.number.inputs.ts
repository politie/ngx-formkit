import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type NumberForm = {
  number: string;
}

export const numberFormFields: FormFields<NumberForm> = {
  number: {
    type: FieldType.Number
  }
};
