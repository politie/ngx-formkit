import { FieldType, FormKitFormConfig } from 'formkit';

export type TextareaForm = {
  textarea: string;
}

export const textareaFormConfig: FormKitFormConfig<TextareaForm> = {
  fields: {
    textarea: {
      type: FieldType.Textarea,
      rows: 6
    }
  }
};
