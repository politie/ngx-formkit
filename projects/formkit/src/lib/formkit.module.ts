import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HumanizePipe } from './pipes/humanize.pipe';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldComponent } from './components/text-field/text-field.component';
import { RadioButtonsFieldComponent } from './components/radio-buttons-field/radio-buttons-field.component';
import { RadioFieldComponent } from './components/radio-field/radio-field.component';
import { HiddenFieldComponent } from './components/hidden-field/hidden-field.component';
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
import { FieldIteratorPipe } from './pipes/field-iterator.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomFieldComponent } from './components/custom-field/custom-field.component';
import { CommonModule } from '@angular/common';
import { FormFieldDirective } from './directives/form-field/form-field.directive';
import { FormKitModuleConfig } from './models/config.model';
import { FORMKIT_MODULE_CONFIG_TOKEN, FORMKIT_MODULE_DEFAULT_CONFIG } from './config';
import { FORM_EVENTS, FormKitService } from './services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    MatCheckboxModule
  ],
  declarations: [
    HumanizePipe,
    FieldIteratorPipe,
    TextFieldComponent,
    RadioButtonsFieldComponent,
    RadioFieldComponent,
    HiddenFieldComponent,
    PasswordFieldComponent,
    SelectFieldComponent,
    FormComponent,
    CheckboxFieldComponent,
    TextareaFieldComponent,
    ArrayFieldComponent,
    FormFieldComponent,
    GroupFieldComponent,
    CustomFieldComponent,
    FormFieldDirective
  ],
  entryComponents: [
    TextFieldComponent,
    TextareaFieldComponent,
    RadioButtonsFieldComponent,
    RadioFieldComponent,
    HiddenFieldComponent,
    PasswordFieldComponent,
    SelectFieldComponent,
    CheckboxFieldComponent,
    ArrayFieldComponent,
    GroupFieldComponent
  ],
  exports: [
    MatButtonModule,
    HumanizePipe,
    FieldIteratorPipe,
    FormComponent,
    TextareaFieldComponent,
    CustomFieldComponent,
    ArrayFieldComponent
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
