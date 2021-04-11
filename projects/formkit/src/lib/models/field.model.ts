import { FormValues, Options } from './form.model';
import { FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export enum FieldType {
  Repeatable,
  Checkbox,
  Custom,
  Date,
  Email,
  Hidden,
  Number,
  Password,
  RadioButton,
  Radio,
  Select,
  Text,
  Textarea,
  Toggle
}

type FieldMessageFunctionPayload<T> = {
  control: FormControl | FormArray | FormGroup,
  errors: ValidationErrors | null,
  values: Required<FormValues<T>>
}

export enum FieldMessageType {
  Information,
  Warning,
  Error
}

export type FieldMessage = {
  type: FieldMessageType,
  text: string
}

export type FieldMessageProperties<T> = {
  show?: boolean | ((payload : FieldMessageFunctionPayload<T>) => boolean)
  type?: FieldMessageType,
  text: string | ((payload : FieldMessageFunctionPayload<T>) => string)
}

type ConditionalFunction<T> = boolean | ((values: T) => boolean);

type IFieldBase<Model, Level, FieldKey extends keyof Level> = {
  type: FieldType;
  component?: any;
  required?: ConditionalFunction<Model>;
  disabled?: ConditionalFunction<Model>;
  hidden?: ConditionalFunction<Model>;
  resetFormOnChange?: boolean;

  /**
   * Optional label. This description is placed as the 'label' above the field
   */
  label?: string;
  /**
   * Optional width of the field. Defaults to full width
   */
  width?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

  /**
   * Optional title. This title is placed above the field
   */
  title?: string;

  /**
   * Optional placeholder
   */
  placeholder?: string;

  /**
   * Optional description. This description is placed inside a <header> **above** the field
   */
  description?: string;

  tooltip?: string;
  messages?: false | FieldMessageProperties<Model>[];
}

type ISingleFieldBase<Model, Level, FieldKey extends keyof Level> = IFieldBase<Model, Level, FieldKey> & {
  value?: Level[FieldKey];
  validators?: ValidatorFn[];
  transform?: (values: Model) => Level[FieldKey] | undefined;
}

export type IRepeatableField<Model, Level, FieldKey extends keyof Level> = IFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Repeatable;
  buttonLabel?: string;
  delete?: boolean;
  max?: number;
  fields: {
    [SubKey in keyof Level[FieldKey]]?: ISingleField<Model, Level[FieldKey], SubKey>;
  }
}

export type ICheckboxField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Checkbox;
  option: Options;
}

export type ICustomField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Custom;
}

export type IHiddenField<Model, Level, FieldKey extends keyof Level> = {
  type: FieldType.Hidden;
  value?: Level[FieldKey];
  validators?: ValidatorFn[];
}

export type IPasswordField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Password;
}

export type IRadioField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Radio | FieldType.RadioButton;
  options: Options[];
}

export type IToggleField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Toggle;
}

export type ISelectField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Select;
  autoselectSingleOption?: boolean;
  options: Options[] | Observable<Options[]>;
  emptyOptionsText?: string;
}

export type ITextField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Date | FieldType.Email | FieldType.Number | FieldType.Text;
}

export type ITextareaField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Textarea;
  minRows?: number;
  maxRows?: number;
}

export type ISingleField<Model, Level, FieldKey extends keyof Level> =
  ICheckboxField<Model, Level, FieldKey> |
  ICustomField<Model, Level, FieldKey> |
  IPasswordField<Model, Level, FieldKey> |
  IRadioField<Model, Level, FieldKey> |
  ISelectField<Model, Level, FieldKey> |
  ITextField<Model, Level, FieldKey> |
  ITextareaField<Model, Level, FieldKey> |
  IToggleField<Model, Level, FieldKey>
;

export type IField<Model, Level, FieldKey extends keyof Level> =
  IRepeatableField<Model, Level, FieldKey> |
  IHiddenField<Model, Level, FieldKey> |
  ISingleField<Model, Level, FieldKey>
;

export type IVisibleField<Model, Level, FieldKey extends keyof Level> =
  IRepeatableField<Model, Level, FieldKey> |
  ISingleField<Model, Level, FieldKey>
;

export type FormFields<Model, Level = Model> = {
  [Key in keyof Level]?: IField<Model, Level, Key>;
};

export type FormKitFormFieldListItem<T> = {
  name: Extract<keyof T, string>;
  field: IVisibleField<T, any, any>;
};
