import { FieldType, FormKitFormConfig } from 'formkit';

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
