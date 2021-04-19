import { FieldType, FormKitFormConfig } from 'formkit';

export type PasswordForm = {
  password: string;
}

export const passwordFormConfig: FormKitFormConfig<PasswordForm> = {
  fields: {
    password: {
      type: FieldType.Password
    }
  }
};
