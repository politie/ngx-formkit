import { FieldType, FormKitFormConfig } from '@politie/ngx-formkit';

export type DateForm = {
  date: string;
}

export const dateFormConfig: FormKitFormConfig<DateForm> = {
  fields: {
    date: {
      type: FieldType.Date
    }
  }
};
