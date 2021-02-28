import { FieldType, FormFields } from 'formkit';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

export type LayoutForm = {
  day: number;
  month: number;
  year: number;
  name: string;
  lastname: string;
  group: {
    array: string;
    aap: boolean
  }
}

export class FormKitValidators {

  static valueExists(control: AbstractControl): boolean {
    const value = control.value;

    if (value === undefined || value === null) {
      return false;
    }

    return value !== '';
  }

  static numberValidator(control: AbstractControl): ValidationErrors | null {
    if (!FormKitValidators.valueExists(control)) {
      return null;
    }

    if (isNaN(control.value)) {
      return { numberRequired: true };
    }

    return null;
  };
}

export const layoutFormFields: FormFields<LayoutForm> = {
  day: {
    type: FieldType.Date,
    control: () => new FormControl(null),
    width: 4
  },
  month: {
    type: FieldType.Text,
    control: () => new FormControl(null, [FormKitValidators.numberValidator]),
    width: 4
  },
  year: {
    type: FieldType.Text,
    control: () => new FormControl(null),
    width: 4
  },
  name: {
    type: FieldType.Text,
    control: () => new FormControl(null),
    width: 6
  },
  lastname: {
    type: FieldType.Text,
    control: () => new FormControl(null),
    width: 6
  },
  group: {
    type: FieldType.Group,
    blueprint: {
      array: {
        type: FieldType.Text,
        control: () => new FormControl('array')
      },
      aap: {
        type: FieldType.Toggle,
        control: () => new FormControl(false),
        disabled: (values) => values.group.array === 'array',
        toggleLabel: 'Disable array field'
      }
    }
  }
};
