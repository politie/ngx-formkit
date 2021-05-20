import { FieldType, FormKitFormConfig } from 'formkit';

export type HiddenForm = {
  input: string;
  checkbox: boolean;
  text: string;
}

export const hiddenFormConfig: FormKitFormConfig<HiddenForm> = {
  fields: {
    checkbox: {
      type: FieldType.Checkbox,
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
