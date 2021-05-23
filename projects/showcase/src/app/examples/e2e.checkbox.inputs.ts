import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type checkboxForm = {
  checkbox: boolean;
}

export const checkboxFormConfig: FormKitFormConfig<checkboxForm> = {
  fields: {
    checkbox: {
      type: FieldType.Checkbox,
      label: 'Checkbox label'
    }
  }
};
