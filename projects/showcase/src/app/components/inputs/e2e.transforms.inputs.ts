import { FieldType, FormKitFormConfig } from 'formkit';

export type TransformsForm = {
  toggle: boolean;
  input: string;
}

export const transformsFormConfig: FormKitFormConfig<TransformsForm> = {

  transforms: values => ({
    ...values.toggle && { input: 'Toggle field is active' }
  }),

  fields: {
    toggle: {
      type: FieldType.Toggle,
      value: false,
      label: 'Toggle me'
    },
    input: {
      type: FieldType.Text,
      status: ({ values }) => ({
        disabled: values.toggle
      })
    }
  }
};
