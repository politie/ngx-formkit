import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type SimpleForm = {
  hidden: string;
  input: string;
  groupie: {
    hiddengroup: string;
  }
}

export const simpleFormFields: FormFields<SimpleForm> = {
  hidden: {
    type: FieldType.Hidden,
    control: () => new FormControl('hidden')
  },
  input: {
    type: FieldType.Text,
    control: () => new FormControl(null),
    disabled: (values) => {
      console.log(values);

      return false;
    }
  },
  groupie: {
    type: FieldType.Group,
    blueprint: {
      hiddengroup: {
        type: FieldType.Hidden,
        control: () => new FormControl('hidden in group')
      }
    }
  }
};
