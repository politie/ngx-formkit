import { FieldType, FormFields } from 'formkit';

export type EmailForm = {
  email: string;
}

export const emailFormFields:FormFields<EmailForm> = {
  email: {
    type: FieldType.Email
  }
};
