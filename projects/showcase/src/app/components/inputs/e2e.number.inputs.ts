import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type NumberForm = {
  number: string;
}

export const numberFormConfig: FormKitFormConfig<NumberForm> = {
  fields: {
    number: {
      type: FieldType.Number
    }
  }
};
