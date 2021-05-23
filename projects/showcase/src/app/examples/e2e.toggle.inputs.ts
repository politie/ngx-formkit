import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

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


