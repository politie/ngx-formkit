import { FieldType, FormFields } from 'formkit';
import { Validators } from '@angular/forms';

export type RepeatableForm = {
  repeatable: {
    firstName: string;
    lastName: string;
  }
}

export const repeatableFormFields:FormFields<RepeatableForm> = {
  repeatable: {
    type: FieldType.Repeatable,
    buttonLabel: 'Add field group to set +',
    max: 5,
    fields: {
      firstName: {
        type: FieldType.Text,
        validators: [Validators.required],
        width: 6
      },
      lastName: {
        type: FieldType.Text,
        value: 'Default value',
        width: 6
      }
    }
  }
};