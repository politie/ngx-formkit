import { FieldType, FormKitFormConfig } from 'formkit';

export type ToggleForm = {
  toggle: boolean;
}

export const toggleFormConfig: FormKitFormConfig<ToggleForm> = {
  fields: {
    toggle: {
      type: FieldType.Toggle,
      value: false,
      label: 'Toggle me'
    }
  }
};


