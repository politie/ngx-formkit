import { FieldType, FormKitFormConfig } from 'formkit';

export type DisabledForm = {
  checkbox: boolean;
  text: string;
}

export const disabledFormConfig: FormKitFormConfig<DisabledForm> = {
  fields: {
    checkbox: {
      type: FieldType.Checkbox,
      value: false,
      option: {
        id: true,
        label: 'Disable text field'
      }
    },
    text: {
      type: FieldType.Text,
      status: ({ values }) => ({
        disabled: values.checkbox
      })
    }
  }
};
