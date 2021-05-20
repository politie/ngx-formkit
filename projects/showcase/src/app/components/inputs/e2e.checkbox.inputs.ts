import { FieldType, FormKitFormConfig } from 'formkit';

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
