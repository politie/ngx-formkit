import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type TextareaForm = {
  textarea: string;
}

export const textareaFormFields: FormFields<TextareaForm> = {
  textarea: {
    type: FieldType.Textarea,
    control: () => new FormControl(null)
  }
};
