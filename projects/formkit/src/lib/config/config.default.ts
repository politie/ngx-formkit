import { FieldType, FormKitModuleConfig } from '../models';
import { CheckboxFieldComponent } from '../components/checkbox-field/checkbox-field.component';
import { PasswordFieldComponent } from '../components/password-field/password-field.component';
import { RadioButtonsFieldComponent } from '../components/radio-buttons-field/radio-buttons-field.component';
import { RadioFieldComponent } from '../components/radio-field/radio-field.component';
import { RepeatableFieldComponent } from '../components/repeatable-field/repeatable-field.component';
import { SelectFieldComponent } from '../components/select-field/select-field.component';
import { TextareaFieldComponent } from '../components/textarea-field/textarea-field.component';
import { TextFieldComponent } from '../components/text-field/text-field.component';
import { ToggleFieldComponent } from '../components/toggle-field/toggle-field.component';

export const FORMKIT_DEFAULT_MESSAGES_EN: { [key: string]: string | ((error: any) => string) } = {
  email: 'This is not a valid email address.',
  required: 'This field is required.',
  min: error => `Value should be at least ${error.min}.`,
  max: error => `Value should be at most ${error.max}.`,
  minlength: error => `Use a minimum of ${error.requiredLength} characters.`,
  maxlength: error => `Use a maximum of ${error.requiredLength} characters.`
};

export const FORMKIT_DEFAULT_MESSAGES_NL: { [key: string]: string | ((error: any) => string) } = {
  email: 'Dit is geen geldig e-mailadres.',
  required: 'Dit veld is verplicht.',
  min: error => `De invoer moet minimaal ${error.min} zijn.`,
  max: error => `De invoer mag maximaal ${error.max} zijn.`,
  minlength: error => `Gebruik minimaal ${error.requiredLength} karakters.`,
  maxlength: error => `Gebruik maximaal ${error.requiredLength} karakters.`
};

export const FORMKIT_MODULE_DEFAULT_CONFIG: Required<FormKitModuleConfig> = {
  messages: FORMKIT_DEFAULT_MESSAGES_EN,

  updateDebounceTime: 150,

  text: {
    loading: 'loading'
  },

  components: {
    [FieldType.Checkbox]: CheckboxFieldComponent,
    [FieldType.Custom]: null,
    [FieldType.Date]: TextFieldComponent,
    [FieldType.Email]: TextFieldComponent,
    [FieldType.Hidden]: null,
    [FieldType.Number]: TextFieldComponent,
    [FieldType.Password]: PasswordFieldComponent,
    [FieldType.RadioButton]: RadioButtonsFieldComponent,
    [FieldType.Radio]: RadioFieldComponent,
    [FieldType.Select]: SelectFieldComponent,
    [FieldType.Repeatable]: RepeatableFieldComponent,
    [FieldType.Textarea]: TextareaFieldComponent,
    [FieldType.Text]: TextFieldComponent,
    [FieldType.Toggle]: ToggleFieldComponent
  }
};
