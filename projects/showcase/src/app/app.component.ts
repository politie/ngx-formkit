import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FormKitFormConfig, ICheckboxField } from '@politie/ngx-formkit';
import { checkboxFormConfig } from './components/inputs/e2e.checkbox.inputs';
import { checkboxesFormConfig } from './components/inputs/e2e.checkboxes.inputs';
import { layoutFormConfig } from './components/inputs/e2e.layout.inputs';
import { dateFormConfig } from './components/inputs/e2e.date.inputs';
import { selectFormConfig } from './components/inputs/e2e.select.inputs';
import { numberFormConfig } from './components/inputs/e2e.number.inputs';
import { radioFormConfig } from './components/inputs/e2e.radio.inputs';
import { transformsFormConfig } from './components/inputs/e2e.transforms.inputs';
import { messagesFormConfig } from './components/inputs/e2e.messages.inputs';
import { hiddenFormConfig } from './components/inputs/e2e.hidden.inputs';
import { requiredFormConfig } from './components/inputs/e2e.required.inputs';
import { emailFormConfig } from './components/inputs/e2e.email.inputs';
import { toggleFormConfig } from './components/inputs/e2e.toggle.inputs';
import { passwordFormConfig } from './components/inputs/e2e.password.inputs';
import { repeatableFormConfig } from './components/inputs/e2e.repeatable.inputs';
import { textFormConfig } from './components/inputs/e2e.text.inputs';
import { simpleFormConfig } from './components/inputs/e2e.simple.inputs';
import { disabledFormConfig } from './components/inputs/e2e.disabled.inputs';
import { textareaFormConfig } from './components/inputs/e2e.textarea.inputs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  debugControl = new FormControl(true);
  debugField: ICheckboxField<any, any, any> = {
    type: FieldType.Checkbox,
    label: 'Toggle debug information (raw values object from each form)'
  };

  /** Configs **/
  exampleFieldSets: { formConfig: FormKitFormConfig<any>, message: string, title: string }[] = [
    {
      title: 'simple',
      message: 'Basic implementation',
      formConfig: simpleFormConfig
    },
    {
      title: 'Disabled',
      message: 'Demo to show the option to make a field disabled based on a condition.',
      formConfig: disabledFormConfig
    },
    {
      title: 'layout',
      message: 'Demo to show different layouts',
      formConfig: layoutFormConfig
    },
    {
      title: 'messages',
      message: 'Demo to show the option to make dynamic field messages',
      formConfig: messagesFormConfig
    },
    {
      title: 'hidden',
      message: 'Demo to show the option to make a field hidden based on a condition.',
      formConfig: hiddenFormConfig
    },
    {
      title: 'required',
      message: 'Demo to show the option to make a field required based on a condition.',
      formConfig: requiredFormConfig
    },
    {
      title: 'transforms',
      message: 'Demo to show the option to transform field values based on other values',
      formConfig: transformsFormConfig
    }
  ];

  fieldTypeFieldSets: { formConfig: FormKitFormConfig<any>, message: string, title: string }[] = [
    {
      title: 'checkbox',
      message: 'Demo to show Checkbox field',
      formConfig: checkboxFormConfig
    },
    {
      title: 'checkboxes',
      message: 'Demo to show Checkbox field with multiple options',
      formConfig: checkboxesFormConfig
    },
    {
      title: 'date',
      message: 'Demo to show Date field',
      formConfig: dateFormConfig
    },
    {
      title: 'email',
      message: 'Demo to show Email field',
      formConfig: emailFormConfig
    },
    {
      title: 'number',
      message: 'Demo to show Number field',
      formConfig: numberFormConfig
    },
    {
      title: 'password',
      message: 'Demo to show Password field',
      formConfig: passwordFormConfig
    },
    {
      title: 'radio buttons',
      message: 'Demo to show Radio buttons field',
      formConfig: radioFormConfig
    },
    {
      title: 'radio',
      message: 'Demo to show Radio field',
      formConfig: radioFormConfig
    },
    {
      title: 'repeatable',
      message: 'Demo to show Repeatable field. The maximum number of input fields you can add is set to 5 in this configuration.',
      formConfig: repeatableFormConfig
    },
    {
      title: 'select',
      message: 'Demo to show Select field',
      formConfig: selectFormConfig
    },
    {
      title: 'text',
      message: 'Demo to show Text field',
      formConfig: textFormConfig
    },
    {
      title: 'textarea',
      message: 'Demo to show Textarea field',
      formConfig: textareaFormConfig
    },
    {
      title: 'toggle',
      message: 'Demo to show Toggle field',
      formConfig: toggleFormConfig
    }
  ];

  trackByFn(index: number, item: any) {
    return item.title;
  }
}
