import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type ArrayForm = {
  array: {
    input: string
  }
}

export const arrayFormFields:FormFields<ArrayForm> = {
  array: {
    type: FieldType.Array,
    buttonLabel: 'Add item to array +',
    maxLength: 5,
    blueprint: {
      input: {
        type: FieldType.Text,
        control: () => new FormControl(),
      }
    }
  }
};
