import { mergeErrors, removeError } from './formcontrol-errors.helpers';

const errorSet = {
  required: true,
  minLength: true,
  maxLength: true
};

describe('Helpers', () => {
  describe('Remove Error by key', () => {
    it('It should return all errors if no key is provided', () => {

      const errors = removeError(errorSet);
      expect(errors).toEqual(errorSet);
    });

    it('It should remove errors by single key', () => {

      const errors = removeError(errorSet, 'minLength');

      expect(errors).toEqual({
        required: true,
        maxLength: true
      });
    });

    it('It should remove errors by multiple keys', () => {
      const errors = removeError(errorSet, 'minLength', 'required');

      expect(errors).toEqual({
        maxLength: true
      });
    });

    it('It should return null if the last error is removed', () => {
      const errors = removeError({
        required: true
      }, 'required');
      expect(errors).toEqual(null);
    });

    it('It should return null if no current errors are present', () => {
      const errors = removeError(null);
      expect(errors).toEqual(null);
    });
  });

  describe('Merge errors', () => {
    it('It should return all errors if no extra error is provided', () => {
      const errors = mergeErrors(errorSet, null);
      expect(errors).toEqual(errorSet);
    });

    it('should only return the new error if no existing error is provided', () => {
      const errors = mergeErrors(null, { required: true });
      expect(errors).toEqual({ required: true });
    });

    it('should return null if both existing errors and new errors are not provided', () => {
      const errors = mergeErrors(null, null);
      expect(errors).toEqual(null);
    });
  });
});
