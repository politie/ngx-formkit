import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type ArrayForm = {
  array: {
    firstName: string;
    lastName: string;
  }
}

export const arrayFormFields:FormFields<ArrayForm> = {
  array: {
    type: FieldType.Array,
    buttonLabel: 'Add field group to array +',
    maxLength: 5,
    blueprint: {
      firstName: {
        type: FieldType.Text,
        control: () => new FormControl(),
        width: 6
      },
      lastName: {
        type: FieldType.Text,
        control: () => new FormControl(),
        width: 6
      }
    }
  }
};
