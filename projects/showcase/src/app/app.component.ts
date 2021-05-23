import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, ISingleField } from '@politie/ngx-formkit';
import { checkboxFormConfig } from './examples/e2e.checkbox.inputs';
import { checkboxesFormConfig } from './examples/e2e.checkboxes.inputs';
import { layoutFormConfig } from './examples/e2e.layout.inputs';
import { dateFormConfig } from './examples/e2e.date.inputs';
import { selectFormConfig } from './examples/e2e.select.inputs';
import { numberFormConfig } from './examples/e2e.number.inputs';
import { radioFormConfig } from './examples/e2e.radio.inputs';
import { transformsFormConfig } from './examples/e2e.transforms.inputs';
import { messagesFormConfig } from './examples/e2e.messages.inputs';
import { hiddenFormConfig } from './examples/e2e.hidden.inputs';
import { requiredFormConfig } from './examples/e2e.required.inputs';
import { emailFormConfig } from './examples/e2e.email.inputs';
import { toggleFormConfig } from './examples/e2e.toggle.inputs';
import { passwordFormConfig } from './examples/e2e.password.inputs';
import { repeatableFormConfig } from './examples/e2e.repeatable.inputs';
import { textFormConfig } from './examples/e2e.text.inputs';
import { simpleFormConfig } from './examples/e2e.simple.inputs';
import { disabledFormConfig } from './examples/e2e.disabled.inputs';
import { textareaFormConfig } from './examples/e2e.textarea.inputs';
import { radioButtonsFormConfig } from './examples/e2e.radio-buttons.inputs';
import { environment } from '../environments/environment';
import { ExampleForm, ExampleTypes } from './app.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  debugControl = new FormControl(false);
  debugField: ISingleField<any, any, any> = {
    type: FieldType.Toggle,
    label: 'Show raw values object in each form'
  };

  ExampleTypes = ExampleTypes;

  exampleForms: ExampleForm[] = [
    {
      type: ExampleTypes.Simple,
      formConfig: simpleFormConfig,
      message: 'The basic implementation of FormKit.'
    },
    {
      type: ExampleTypes.Layout,
      message: 'Demo to show different layouts. The `day` input has the resetFormOnChange property set and will reset all other inputs in the form to their default values.',
      formConfig: layoutFormConfig
    },
    {
      type: ExampleTypes.Messages,
      message: 'Demo to show the option to make dynamic field messages. The first message will only show if the field is empty. If the field has a value, a message will show that shows the length of the value. The field config property `showMessagesIfControlIsUntouched` is set to force the message to be shown even if the control is untouched.',
      formConfig: messagesFormConfig
    },
    {
      type: ExampleTypes.Transforms,
      message: 'Demo to show the option to transform field values based on other values',
      formConfig: transformsFormConfig
    }
  ];

  statusForms: ExampleForm[] = [
    {
      type: ExampleTypes.Disabled,
      message: 'Demo to show the option to make a field disabled based on a condition.',
      formConfig: disabledFormConfig
    },
    {
      type: ExampleTypes.Hidden,
      message: 'Demo to show the option to make a field hidden based on a condition.',
      formConfig: hiddenFormConfig
    },
    {
      type: ExampleTypes.Required,
      message: 'Demo to show the option to make a field required based on a condition. Press the submit button to force the error state (if the checkbox is checked).',
      formConfig: requiredFormConfig
    },
  ];

  fieldTypeForms: ExampleForm[] = [
    {
      type: ExampleTypes.Checkbox,
      message: 'Demo to show Checkbox field',
      formConfig: checkboxFormConfig
    },
    {
      type: ExampleTypes.Checkboxes,
      message: 'Demo to show Checkbox field with multiple options',
      formConfig: checkboxesFormConfig
    },
    {
      type: ExampleTypes.Date,
      message: 'Demo to show Date field',
      formConfig: dateFormConfig
    },
    {
      type: ExampleTypes.Email,
      message: 'Demo to show Email field',
      formConfig: emailFormConfig
    },
    {
      type: ExampleTypes.Number,
      message: 'Demo to show Number field',
      formConfig: numberFormConfig
    },
    {
      type: ExampleTypes.Password,
      message: 'Demo to show Password field',
      formConfig: passwordFormConfig
    },
    {
      type: ExampleTypes.RadioButtons,
      message: 'Demo to show Radio buttons field',
      formConfig: radioButtonsFormConfig
    },
    {
      type: ExampleTypes.Radio,
      message: 'Demo to show Radio field',
      formConfig: radioFormConfig
    },
    {
      type: ExampleTypes.Repeatable,
      message: 'Demo to show Repeatable field. The maximum number of input fields you can add is set to 5 in this configuration.',
      formConfig: repeatableFormConfig
    },
    {
      type: ExampleTypes.Select,
      message: 'Demo to show Select field',
      formConfig: selectFormConfig
    },
    {
      type: ExampleTypes.Text,
      message: 'Demo to show Text field',
      formConfig: textFormConfig
    },
    {
      type: ExampleTypes.Textarea,
      message: 'Demo to show Textarea field',
      formConfig: textareaFormConfig
    },
    {
      type: ExampleTypes.Toggle,
      message: 'Demo to show Toggle field',
      formConfig: toggleFormConfig
    }
  ];

  constructor(private window: Window) {
  }

  ngAfterViewInit() {
    /**
     * Grab the hash and scrollTo
     */
    if (this.window.location.hash) {
      const element = document.getElementById(window.location.hash);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  get urlToGithubReadme(): string {
    return `${environment.repoLink}#readme`;
  }

  trackByFn(index: number, item: any) {
    return item.title;
  }
}
