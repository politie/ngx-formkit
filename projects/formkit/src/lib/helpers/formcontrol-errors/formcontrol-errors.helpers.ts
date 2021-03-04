import { ValidationErrors } from '@angular/forms';
import { utilities } from '../utilities/utilities.helpers';

export const removeError = (errors: ValidationErrors | null, ...keys: string[]): ValidationErrors | null => {
  /**
   * If there aren't any errors, break and return null since there's nothing to delete.
   */
  if (!errors) {
    return null;
  }

  /**
   * Spread the errors to create a new object reference.
   */
  const remainingErrors: ValidationErrors = { ...errors };

  /**
   * Loop through the keys
   */
  for (const key of keys) {
    if (remainingErrors.hasOwnProperty(key)) {
      delete remainingErrors[key];
    }
  }

  /**
   * Check if the object is empty, if so: return null, else return the object with the errors
   */
  if (utilities.isEmptyObject(remainingErrors)) {
    return null;
  } else {
    return remainingErrors;
  }
};

export const mergeErrors = (errors: ValidationErrors | null, error: { [key: string]: any } | null): ValidationErrors | null => {
  if (errors && !utilities.isEmptyObject(errors)) {
    return { ...errors, ...error };
  } else if (error && !utilities.isEmptyObject(error)) {
    return error;
  } else {
    return null;
  }
};
