import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type SimpleForm = {
  input: string;
}

export const simpleFormFields: FormFields<SimpleForm> = {
  input: {
    type: FieldType.Text,
    control: () => new FormControl(null),
    width: 8
  }
};
