import { FieldType, FormFields } from 'formkit';

export type ArrayForm = {
  array: {
    firstName: string;
    lastName: string;
  }
}

export const repeatableFormFields:FormFields<ArrayForm> = {
  array: {
    type: FieldType.Repeatable,
    buttonLabel: 'Add field group to array +',
    maxLength: 5,
    fields: {
      firstName: {
        type: FieldType.Text,
        width: 6
      },
      lastName: {
        type: FieldType.Text,
        width: 6
      }
    }
  }
};
