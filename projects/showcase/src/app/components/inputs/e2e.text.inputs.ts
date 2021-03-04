import { FieldType, FormFields } from 'formkit';

export type TextForm = {
  text: string;
}

export const textFormFields: FormFields<TextForm> = {
  text: {
    type: FieldType.Text
  }
};
