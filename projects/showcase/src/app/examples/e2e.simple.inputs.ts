import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type SimpleForm = {
  input: string;
}

export const simpleFormConfig: FormKitFormConfig<SimpleForm> = {
  fields: {
    input: {
      type: FieldType.Text,
      placeholder: 'Type here...',
      header: {
        title: 'Regular text field',
        description: 'This form just renders a textfield.'
      }
    }
  }
};
