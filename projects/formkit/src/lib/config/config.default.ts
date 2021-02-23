import { FieldType, FormKitModuleConfig } from '../models';
import { ArrayFieldComponent } from '../components/array-field/array-field.component';
import { CheckboxFieldComponent } from '../components/checkbox-field/checkbox-field.component';
import { GroupFieldComponent } from '../components/group-field/group-field.component';
import { HiddenFieldComponent } from '../components/hidden-field/hidden-field.component';
import { PasswordFieldComponent } from '../components/password-field/password-field.component';
import { RadioButtonsFieldComponent } from '../components/radio-buttons-field/radio-buttons-field.component';
import { RadioFieldComponent } from '../components/radio-field/radio-field.component';
import { SelectFieldComponent } from '../components/select-field/select-field.component';
import { TextareaFieldComponent } from '../components/textarea-field/textarea-field.component';
import { TextFieldComponent } from '../components/text-field/text-field.component';
import { CustomFieldComponent } from '../components/custom-field/custom-field.component';

export const FORMKIT_MODULE_DEFAULT_CONFIG: Required<FormKitModuleConfig> = {
  text: {
    loading: 'loading'
  },
  components: {
    [FieldType.Password]: PasswordFieldComponent,
    [FieldType.Hidden]: HiddenFieldComponent,
    [FieldType.Radio]: RadioFieldComponent,
    [FieldType.RadioButton]: RadioButtonsFieldComponent,
    [FieldType.Select]: SelectFieldComponent,
    [FieldType.Text]: TextFieldComponent,
    [FieldType.Textarea]: TextareaFieldComponent,
    [FieldType.Checkbox]: CheckboxFieldComponent,
    [FieldType.Array]: ArrayFieldComponent,
    [FieldType.Group]: GroupFieldComponent,
    [FieldType.Custom]: CustomFieldComponent
  }
};
