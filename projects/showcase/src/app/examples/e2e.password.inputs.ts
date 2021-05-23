import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

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
