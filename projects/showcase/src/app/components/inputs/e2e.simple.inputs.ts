import { FieldType, FormFields } from 'formkit';

export type SimpleForm = {
  input: string;
}

export const simpleFormFields: FormFields<SimpleForm> = {
  input: {
    type: FieldType.Text,
    width: 8
  }
};
