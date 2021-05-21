import { FieldType, FormKitFormConfig, FormKitValidators } from 'formkit';

export type CheckboxesForm = {
  checkboxes: number[];
}

export const checkboxesFormConfig: FormKitFormConfig<CheckboxesForm> = {
  fields: {
    checkboxes: {
      type: FieldType.Checkbox,
      value: [],
      messages: ({ errors }) => ([
        {
          show: errors.arrayminchecked,
          text: `Min ${errors.arrayminchecked?.min} required. You now have ${errors.arrayminchecked?.actual} checked.`
        },
        {
          show: errors.arraymaxchecked,
          text: `Max ${errors.arraymaxchecked?.max} required. You now have ${errors.arraymaxchecked?.actual} checked.`
        }
      ]),
      validators: [FormKitValidators.arrayMinChecked(2), FormKitValidators.arrayMaxChecked(2)],
      options: [
        {
          id: 1,
          label: 'First label'
        },
        {
          id: 2,
          label: 'Second label'
        },
        {
          id: 3,
          label: 'Third label'
        },
        {
          id: 4,
          label: 'Fourth label'
        }
      ]
    }
  }
};
