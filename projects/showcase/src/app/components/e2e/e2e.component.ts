import { Component } from '@angular/core';
import { FieldType, FormFields } from 'formkit';
import { messagesFormFields } from './inputs/e2e.messages.inputs';
import { hiddenFormFields } from './inputs/e2e.hidden.inputs';
import { requiredFormFields } from './inputs/e2e.required.inputs';
import { simpleFormFields } from './inputs/e2e.simple.inputs';
import { FormControl, FormGroup } from '@angular/forms';
import { kichenSinkFormFields } from './inputs/e2e.kitchen-sink.inputs';

@Component({
  selector: 'app-e2e',
  templateUrl: './e2e.component.html',
  styleUrls: ['./e2e.component.css']
})
export class E2eComponent {
  form = new FormGroup({});
  fields: FormFields<any> = {
    toggle: {
      type: FieldType.Toggle,
      control: () => new FormControl(false),
      toggleLabel: 'Toggle debug information'
    }
  }

  /** Configs **/
  fieldSets: { fields: any, message: string, title: string }[] = [
    {
      title: 'simple',
      message: 'Basic implementation',
      fields: simpleFormFields
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
    },
    {
      title: 'Kitchen sink',
      message: 'All available controls with some magic',
      fields: kichenSinkFormFields
    }
  ];
}
