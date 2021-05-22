import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type DisabledForm = {
  checkbox: boolean;
  text: string;
}

export const disabledFormConfig: FormKitFormConfig<DisabledForm> = {
  fields: {
    checkbox: {
      type: FieldType.Checkbox,
      label: 'Disable text field'
    },
    text: {
      type: FieldType.Text,
      status: ({ values }) => ({
        disabled: values.checkbox
      })
    }
  }
};
