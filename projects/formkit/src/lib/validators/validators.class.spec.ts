import { FormKitValidators } from './validators.class';
import { FormControl } from '@angular/forms';

describe('Validators', () => {

  describe('arrayMinChecked validator', () => {
    const arrayMinCheckedValidator = FormKitValidators.arrayMinChecked(1);

    it('should throw a error if a value is not array like', () => {
      const control = new FormControl(null);
      expect(() => arrayMinCheckedValidator(control)).toThrowError('Trying to use a Array validator on a non array value.');
    });

    it('should return error if length is less than min', () => {
      const control = new FormControl([]);

      expect(arrayMinCheckedValidator(control)).toEqual({
        arrayminchecked: {
          actual: 0,
          min: 1
        }
      });
    });

    it('should return error if truthy length is less than min', () => {
      const control = new FormControl([false, false]);

      expect(arrayMinCheckedValidator(control)).toEqual({
        arrayminchecked: {
          actual: 0,
          min: 1
        }
      });
    });

    it('should return null if truthy length is equal or larger than min', () => {
      const control = new FormControl([true]);
      expect(arrayMinCheckedValidator(control)).toEqual(null);
    });
  });

  describe('arrayMaxChecked validator', () => {
    const arrayMaxCheckedValidator = FormKitValidators.arrayMaxChecked(2);

    it('should throw a error if a value is not array like', () => {
      const control = new FormControl(null);
      expect(() => arrayMaxCheckedValidator(control)).toThrowError('Trying to use a Array validator on a non array value.');
    });

    it('should return error if length is larger than max', () => {
      const control = new FormControl([true, true, true]);
      expect(arrayMaxCheckedValidator(control)).toEqual({
        arraymaxchecked: {
          actual: 3,
          max: 2
        }
      });
    });

    it('should return error if truthy length is equal to max', () => {
      const control = new FormControl([true, true]);
      expect(arrayMaxCheckedValidator(control)).toEqual(null);
    });

    it('should return error if truthy length is less to max', () => {
      const control = new FormControl([true]);
      expect(arrayMaxCheckedValidator(control)).toEqual(null);
    });
  });
});
