import { FieldType, FormFields } from 'formkit';

export type ToggleForm = {
  toggle: boolean;
}

export const toggleFormFields: FormFields<ToggleForm> = {
  toggle: {
    type: FieldType.Toggle,
    value: false,
    label: 'Toggle me'
  }
};


