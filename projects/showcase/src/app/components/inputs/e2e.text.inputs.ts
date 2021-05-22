import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type TextForm = {
  text: string;
}

export const textFormConfig: FormKitFormConfig<TextForm> = {
  fields: {
    text: {
      type: FieldType.Text
    }
  }
};
