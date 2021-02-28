import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type TextForm = {
  text: string;
}

export const textFormFields: FormFields<TextForm> = {
  text: {
    type: FieldType.Text,
    control: () => new FormControl(null)
  }
};
