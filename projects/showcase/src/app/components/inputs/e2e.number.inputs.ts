import { FieldType, FormKitFormConfig } from 'formkit';

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
