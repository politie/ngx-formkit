import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type SimpleForm = {
  input: string;
}

export const simpleFormConfig: FormKitFormConfig<SimpleForm> = {
  fields: {
    input: {
      type: FieldType.Text,
      autofocus: true,
      header: {
        title: 'Simple',
        tooltip: 'Lorem'
      }
    }
  }
};
