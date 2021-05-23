import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type HiddenForm = {
  input: string;
  checkbox: boolean;
  text: string;
}

export const hiddenFormConfig: FormKitFormConfig<HiddenForm> = {
  fields: {
    checkbox: {
      type: FieldType.Toggle,
      label: 'Hide text field'
    },
    input: {
      type: FieldType.Text,
      status: ({values}) => ({
        hidden: values.checkbox
      })
    },
    text: {
      type: FieldType.Text
    }
  }
};
