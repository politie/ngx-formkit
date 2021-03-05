import { FieldType } from './field.model';

export type FormKitModuleConfig = {

  /**
   * Sets the debounce before calling updates for all conditional logic in the form (messages, required, disabled) if
   * a user edits something in the form.
   */
  updateDebounceTime?: number;

  /**
   * Object with text properties that are used in the form
   */
  text: {
    loading?: string;
  }

  /**
   * Set of components per FieldType
   */
  components: {
    [key in FieldType]?: any;
  }
}
