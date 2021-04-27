import { FieldType, FormKitFormConfig, FormKitValidators } from 'formkit';

export type CheckboxesForm = {
  checkboxes: boolean[];
}

export const checkboxesFormConfig: FormKitFormConfig<CheckboxesForm> = {
  fields: {
    checkboxes: {
      type: FieldType.Checkbox,
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
      value: [true, false],
      options: [
        {
          id: 1,
          label: 'First label',
          description: 'First description'
        },
        {
          id: 2,
          label: 'Second label',
          description: 'Second description'
        },
        {
          id: 3,
          label: 'Third label',
          description: 'Third description'
        },
        {
          id: 4,
          label: 'Fourth label',
          description: 'Fourth description'
        }
      ]
    }
  }
};
