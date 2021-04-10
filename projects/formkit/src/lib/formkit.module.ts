import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HumanizePipe } from './pipes/humanize.pipe';
import { RadioButtonsFieldComponent } from './components/radio-buttons-field/radio-buttons-field.component';
import { RadioFieldComponent } from './components/radio-field/radio-field.component';
import { PasswordFieldComponent } from './components/password-field/password-field.component';
import { SelectFieldComponent } from './components/select-field/select-field.component';
import { FormComponent } from './components/form/root-form/form.component';
import { CheckboxFieldComponent } from './components/checkbox-field/checkbox-field.component';
import { TextareaFieldComponent } from './components/textarea-field/textarea-field.component';
import { RepeatableFieldComponent } from './components/repeatable-field/repeatable-field.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { GroupFieldComponent } from './components/group-field/group-field.component';
import { CommonModule } from '@angular/common';
import { FormFieldDirective } from './directives/form-field/form-field.directive';
import { FormKitModuleConfig } from './models/config.model';
import { FORMKIT_MODULE_CONFIG_TOKEN, FORMKIT_MODULE_DEFAULT_CONFIG } from './config';
import { ToggleFieldComponent } from './components/toggle-field/toggle-field.component';
import { FieldBaseComponent } from './components/field-base/field-base.component';
import { TextFieldComponent } from './components/text-field/text-field.component';
import { NestedFormComponent } from './components/form/nested-form/nested-form.component';
import { FormBaseComponent } from './components/form/form-base/form-base.component';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextFieldModule
  ],
  declarations: [
    FormFieldDirective,
    HumanizePipe,
    RepeatableFieldComponent,
    CheckboxFieldComponent,
    FieldBaseComponent,
    FormComponent,
    FormFieldComponent,
    GroupFieldComponent,
    PasswordFieldComponent,
    RadioButtonsFieldComponent,
    RadioFieldComponent,
    SelectFieldComponent,
    TextFieldComponent,
    TextareaFieldComponent,
    ToggleFieldComponent,
    NestedFormComponent,
    FormBaseComponent
  ],
  entryComponents: [
    RepeatableFieldComponent,
    CheckboxFieldComponent,
    FieldBaseComponent,
    FormComponent,
    FormFieldComponent,
    GroupFieldComponent,
    PasswordFieldComponent,
    RadioButtonsFieldComponent,
    RadioFieldComponent,
    SelectFieldComponent,
    TextFieldComponent,
    TextareaFieldComponent,
    ToggleFieldComponent
  ],
  exports: [
    HumanizePipe,
    FormComponent,
    FieldBaseComponent,
    FormFieldComponent
  ]
})
export class FormKitModule {
  static forRoot(config?: Partial<FormKitModuleConfig>): ModuleWithProviders<FormKitModule> {

    /**
     * Since NgPackagr will complain about lambda's, we add
     * the @dynamic decorator right here to let the build --prod pass.
     */
    // @dynamic
    const mergeUserConfigWithDefaultConfig = () => ({ ...FORMKIT_MODULE_DEFAULT_CONFIG, ...config });

    return {
      ngModule: FormKitModule,
      providers: [
        {
          provide: FORMKIT_MODULE_CONFIG_TOKEN,
          useFactory: mergeUserConfigWithDefaultConfig
        }
      ]
    };
  }
}
