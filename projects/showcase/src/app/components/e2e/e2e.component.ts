import { Component } from '@angular/core';
import { basicFormConfig } from './inputs/e2e.basic.inputs';
import { FormKitForm } from 'formkit';
import { messagesFormConfig } from './inputs/e2e.messages.inputs';
import { hiddenFormConfig } from './inputs/e2e.hidden.inputs';
import { requiredFormConfig } from './inputs/e2e.required.inputs';

@Component({
  selector: 'app-e2e',
  templateUrl: './e2e.component.html',
  styleUrls: ['./e2e.component.css']
})
export class E2eComponent {

  /** Configs **/
  configs: { config: FormKitForm<any>, title: string }[] = [
    {
      title: 'basic',  config: basicFormConfig
    },
    {
      title: 'messages', config: messagesFormConfig
    },
    {
      title: 'hidden', config: hiddenFormConfig
    },
    {
      title: 'required',  config: requiredFormConfig
    }
  ];
}
