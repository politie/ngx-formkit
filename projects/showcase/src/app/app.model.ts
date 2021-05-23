import { FormKitFormConfig } from '@politie/ngx-formkit';

export enum ExampleTypes {
  Checkbox,
  Checkboxes,
  Date,
  Disabled,
  Email,
  Hidden,
  Layout,
  Messages,
  Number,
  Password,
  Radio,
  RadioButtons,
  Repeatable,
  Required,
  Select,
  Simple,
  Text,
  Textarea,
  Toggle,
  Transforms
}

export type ExampleForm = {
  formConfig: FormKitFormConfig<any>,
  message: string,
  type: ExampleTypes
};
