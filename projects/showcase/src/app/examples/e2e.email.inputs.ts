import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type EmailForm = {
  email: string;
}

export const emailFormConfig:FormKitFormConfig<EmailForm> = {
  fields: {
    email: {
      type: FieldType.Email
    }
  }
};
