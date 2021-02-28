import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type EmailForm = {
  email: string;
}

export const emailFormFields:FormFields<EmailForm> = {
  email: {
    type: FieldType.Email,
    control: () => new FormControl()
  }
};
