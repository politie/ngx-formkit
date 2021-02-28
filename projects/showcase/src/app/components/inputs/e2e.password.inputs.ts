import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type PasswordForm = {
  password: string;
}

export const passwordFormFields:FormFields<PasswordForm> = {
  password: {
    type: FieldType.Password,
    control: () => new FormControl()
  }
};
