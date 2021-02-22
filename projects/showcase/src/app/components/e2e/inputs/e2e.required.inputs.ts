import { FieldType, FormKitForm } from 'formkit';
import { FormControl } from '@angular/forms';

export type RequiredForm = {
  input: string;
  checkbox: boolean;
}

export const requiredFormConfig:FormKitForm<RequiredForm> = {
  fields: {
    input: {
      type: FieldType.Text,
      control: () => new FormControl(),
      required: values => values.checkbox === true
    },
    checkbox: {
      type: FieldType.Checkbox,
      control: () => new FormControl(false),
      option: {
        id: 'basic-1',
        label: 'Check to make Textfield required'
      }
    }
  }
};
