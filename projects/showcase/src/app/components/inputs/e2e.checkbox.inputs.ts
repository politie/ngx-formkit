import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type checkboxForm = {
  checkbox: boolean;
}

export const checkboxFormFields:FormFields<checkboxForm> = {
  checkbox: {
    type: FieldType.Checkbox,
    option: {
      id: 1,
      label: 'Checkbox'
    },
    control: () => new FormControl(false)
  }
};
