import { FieldType, FormKitForm } from 'formkit';
import { FormControl } from '@angular/forms';

export type HiddenForm = {
  input: string;
  checkbox: boolean;
}

export const hiddenFormConfig:FormKitForm<HiddenForm> = {
  fields: {
    input: {
      type: FieldType.Text,
      control: () => new FormControl(),
      hidden: values => values.checkbox === true
    },
    checkbox: {
      type: FieldType.Checkbox,
      control: () => new FormControl(false),
      option: {
        id: 'messages-1',
        label: 'Check to make Textfield hidden'
      }
    }
  }
};
