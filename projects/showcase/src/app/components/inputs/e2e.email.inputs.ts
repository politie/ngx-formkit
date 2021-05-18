import { FieldType, FormKitFormConfig } from 'formkit';

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
