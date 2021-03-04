import { FieldType, FormFields } from 'formkit';

export type TextareaForm = {
  textarea: string;
}

export const textareaFormFields: FormFields<TextareaForm> = {
  textarea: {
    type: FieldType.Textarea
  }
};
