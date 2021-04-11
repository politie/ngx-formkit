import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType, FormFields } from 'formkit';
import { simpleFormFields } from './components/inputs/e2e.simple.inputs';
import { messagesFormFields } from './components/inputs/e2e.messages.inputs';
import { hiddenFormFields } from './components/inputs/e2e.hidden.inputs';
import { requiredFormFields } from './components/inputs/e2e.required.inputs';
import { layoutFormFields } from './components/inputs/e2e.layout.inputs';
import { repeatableFormFields } from './components/inputs/e2e.repeatable.inputs';
import { checkboxFormFields } from './components/inputs/e2e.checkbox.inputs';
import { emailFormFields } from './components/inputs/e2e.email.inputs';
import { dateFormFields } from './components/inputs/e2e.date.inputs';
import { numberFormFields } from './components/inputs/e2e.number.inputs';
import { passwordFormFields } from './components/inputs/e2e.password.inputs';
import { radioButtonsFormFields } from './components/inputs/e2e.radio-buttons.inputs';
import { radioFormFields } from './components/inputs/e2e.radio.inputs';
import { selectFormFields } from './components/inputs/e2e.select.inputs';
import { textFormFields } from './components/inputs/e2e.text.inputs';
import { textareaFormFields } from './components/inputs/e2e.textarea.inputs';
import { toggleFormFields } from './components/inputs/e2e.toggle.inputs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form = new FormGroup({});
  fields: FormFields<any> = {
    toggle: {
      type: FieldType.Toggle,
      value: true,
      label: 'Toggle debug information (raw values object from each form)'
    }
  }

  /** Configs **/
  exampleFieldSets: { fields: any, message: string, title: string }[] = [
    {
      title: 'simple',
      message: 'Basic implementation',
      fields: simpleFormFields
    },
    {
      title: 'layout',
      message: 'Demo to show different layouts',
      fields: layoutFormFields
    },
    {
      title: 'messages',
      message: 'Demo to show the option to make dynamic field messages',
      fields: messagesFormFields
    },
    {
      title: 'hidden',
      message: 'Demo to show the option to make a field hidden based on a condition.',
      fields: hiddenFormFields
    },
    {
      title: 'required',
      message: 'Demo to show the option to make a field required based on a condition.',
      fields: requiredFormFields
    }
  ];

  fieldTypeFieldSets: { fields: any, message: string, title: string }[] = [

    {
      title: 'checkbox',
      message: 'Demo to show Checkbox field',
      fields: checkboxFormFields
    },
    {
      title: 'date',
      message: 'Demo to show Date field',
      fields: dateFormFields
    },
    {
      title: 'email',
      message: 'Demo to show Email field',
      fields: emailFormFields
    },
    {
      title: 'number',
      message: 'Demo to show Number field',
      fields: numberFormFields
    },
    {
      title: 'password',
      message: 'Demo to show Password field',
      fields: passwordFormFields
    },
    {
      title: 'radio buttons',
      message: 'Demo to show Radio buttons field',
      fields: radioButtonsFormFields
    },
    {
      title: 'radio',
      message: 'Demo to show Radio field',
      fields: radioFormFields
    },
    {
      title: 'repeatable',
      message: 'Demo to show Repeatable field. The maximum number of input fields you can add is set to 5 in this configuration.',
      fields: repeatableFormFields
    },
    {
      title: 'select',
      message: 'Demo to show Select field',
      fields: selectFormFields
    },
    {
      title: 'text',
      message: 'Demo to show Text field',
      fields: textFormFields
    },
    {
      title: 'textarea',
      message: 'Demo to show Textarea field',
      fields: textareaFormFields
    },
    {
      title: 'toggle',
      message: 'Demo to show Toggle field',
      fields: toggleFormFields
    }
  ];
}
