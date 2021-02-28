import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type ToggleForm = {
  toggle: boolean;
}

export const toggleFormFields: FormFields<ToggleForm> = {
  toggle: {
    type: FieldType.Toggle,
    control: () => new FormControl(false),
    label: 'Toggle me'
  }
};


