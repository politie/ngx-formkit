import { FieldType, FormKitModuleConfig } from '../models';
import { ArrayFieldComponent } from '../components/array-field/array-field.component';
import { CheckboxFieldComponent } from '../components/checkbox-field/checkbox-field.component';
import { GroupFieldComponent } from '../components/group-field/group-field.component';
import { PasswordFieldComponent } from '../components/password-field/password-field.component';
import { RadioButtonsFieldComponent } from '../components/radio-buttons-field/radio-buttons-field.component';
import { RadioFieldComponent } from '../components/radio-field/radio-field.component';
import { SelectFieldComponent } from '../components/select-field/select-field.component';
import { TextareaFieldComponent } from '../components/textarea-field/textarea-field.component';
import { TextFieldComponent } from '../components/text-field/text-field.component';
import { ToggleFieldComponent } from '../components/toggle-field/toggle-field.component';
import { FieldBaseComponent } from '../components';

export const FORMKIT_MODULE_DEFAULT_CONFIG: Required<FormKitModuleConfig> = {
  messages: {
    email: 'This is not a valid email address.',
    required: 'This field is required.',
    min: error => `Value should be at least ${error.min}.`,
    max: error => `Value should be at most ${error.max}.`,
    minlength: error => `Use a minimum of ${error.requiredLength} characters.`,
    maxlength: error => `Use a maximum of ${error.requiredLength} characters.`
  },

  updateDebounceTime: 200,

  text: {
    loading: 'loading'
  },

  components: {
    [FieldType.Array]: ArrayFieldComponent,
    [FieldType.Checkbox]: CheckboxFieldComponent,
    [FieldType.Custom]: FieldBaseComponent,
    [FieldType.Date]: TextFieldComponent,
    [FieldType.Email]: TextFieldComponent,
    [FieldType.Group]: GroupFieldComponent,
    [FieldType.Hidden]: null,
    [FieldType.Number]: TextFieldComponent,
    [FieldType.Password]: PasswordFieldComponent,
    [FieldType.RadioButton]: RadioButtonsFieldComponent,
    [FieldType.Radio]: RadioFieldComponent,
    [FieldType.Select]: SelectFieldComponent,
    [FieldType.Textarea]: TextareaFieldComponent,
    [FieldType.Text]: TextFieldComponent,
    [FieldType.Toggle]: ToggleFieldComponent
  }
};
