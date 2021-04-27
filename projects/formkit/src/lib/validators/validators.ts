import { ValidatorFn } from '@angular/forms';
import { utilities } from '../helpers';

export class FormKitValidators {
  static arrayMinChecked(min: number): ValidatorFn {
    return (control) => {
      if (!Array.isArray(control.value)) {
        throw new Error('Trying to use a Array validator on a non array value.');
      }

      const actual = utilities.truthyArrayValuesLength(control.value);

      return actual >= min ? null : { arrayminchecked: { min, actual } };
    };
  }

  static arrayMaxChecked(max: number): ValidatorFn {
    return (control) => {

      if (!Array.isArray(control.value)) {
        throw new Error('Trying to use a Array validator on a non array value.');
      }

      const actual = utilities.truthyArrayValuesLength(control.value);

      return actual <= max ? null : { arraymaxchecked: { max, actual } };
    };
  }
}
