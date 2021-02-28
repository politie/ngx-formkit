import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HumanizePipe } from './pipes/humanize.pipe';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RadioButtonsFieldComponent } from './components/radio-buttons-field/radio-buttons-field.component';
import { RadioFieldComponent } from './components/radio-field/radio-field.component';
import { PasswordFieldComponent } from './components/password-field/password-field.component';
import { SelectFieldComponent } from './components/select-field/select-field.component';
import { MatSelectModule } from '@angular/material/select';
import { FormComponent } from './components/form/form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CheckboxFieldComponent } from './components/checkbox-field/checkbox-field.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TextareaFieldComponent } from './components/textarea-field/textarea-field.component';
import { ArrayFieldComponent } from './components/array-field/array-field.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { GroupFieldComponent } from './components/group-field/group-field.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormFieldDirective } from './directives/form-field/form-field.directive';
import { FormKitModuleConfig } from './models/config.model';
import { FORMKIT_MODULE_CONFIG_TOKEN, FORMKIT_MODULE_DEFAULT_CONFIG } from './config';
import { ToggleFieldComponent } from './components/toggle-field/toggle-field.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FieldBaseComponent } from './components/field-base/field-base.component';
import { TextFieldComponent } from './components/text-field/text-field.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatRadioModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  declarations: [
    FormFieldDirective,
    HumanizePipe,
    ArrayFieldComponent,
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
  entryComponents: [
    ArrayFieldComponent,
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
    FieldBaseComponent
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
