import { Component } from '@angular/core';
import { basicFormFields } from './inputs/e2e.basic.inputs';
import { FormFields } from 'formkit';
import { messagesFormFields } from './inputs/e2e.messages.inputs';
import { hiddenFormFields } from './inputs/e2e.hidden.inputs';
import { requiredFormFields } from './inputs/e2e.required.inputs';

@Component({
  selector: 'app-e2e',
  templateUrl: './e2e.component.html',
  styleUrls: ['./e2e.component.css']
})
export class E2eComponent {

  /** Configs **/
  fieldSets: { fields: FormFields<any>, title: string }[] = [
    {
      title: 'basic',  fields: basicFormFields
    },
    // {
    //   title: 'messages', fields: messagesFormFields
    // },
    // {
    //   title: 'hidden', fields: hiddenFormFields
    // },
    // {
    //   title: 'required',  fields: requiredFormFields
    // }
  ];
}
