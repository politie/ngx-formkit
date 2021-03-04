import { FieldType, FormFields } from 'formkit';

export type DateForm = {
  date: string;
}

export const dateFormFields:FormFields<DateForm> = {
  date: {
    type: FieldType.Date
  }
};
