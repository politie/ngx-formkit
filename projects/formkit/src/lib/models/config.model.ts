import { FieldType } from './field.model';

export type FormKitModuleConfig = {
  text: {
    loading?: string;
  }

  components: {
    [key in FieldType]?: any;
  }
}
