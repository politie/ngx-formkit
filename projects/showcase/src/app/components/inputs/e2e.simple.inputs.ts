import { FieldType, FormFields } from 'formkit';

export type SimpleForm = {
  input: string;
}

export const simpleFormFields: FormFields<SimpleForm> = {
  input: {
    type: FieldType.Text,
    autofocus: true,
    header: {
      title: 'Simple',
      tooltip: 'Lorem'
    }
  }
};
