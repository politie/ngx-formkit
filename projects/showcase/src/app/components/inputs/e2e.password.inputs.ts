import { FieldType, FormFields } from 'formkit';

export type PasswordForm = {
  password: string;
}

export const passwordFormFields:FormFields<PasswordForm> = {
  password: {
    type: FieldType.Password
  }
};
