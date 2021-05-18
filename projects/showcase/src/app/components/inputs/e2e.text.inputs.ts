import { FieldType, FormKitFormConfig } from 'formkit';

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
