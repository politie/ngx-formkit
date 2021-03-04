import { FieldType, FormFields } from 'formkit';

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
    value: false
  }
};
