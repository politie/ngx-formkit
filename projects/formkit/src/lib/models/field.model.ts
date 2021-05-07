import { FormValueTransformFunction, Options } from './form.model';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export enum FieldType {
  Checkbox,
  Custom,
  Date,
  Email,
  Hidden,
  Number,
  Password,
  RadioButton,
  Radio,
  Repeatable,
  Select,
  Text,
  Textarea,
  Toggle
}

type FieldMessageFunctionPayload<T> = {
  control: AbstractControl | FormControl | FormArray | FormGroup;
  errors: ValidationErrors;
  values: T;
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

export type FieldMessagesFunction<T> = (payload: FieldMessageFunctionPayload<T>) => { show: boolean, type?: FieldMessageType, text: string }[];

type IFieldBase<Model, Level, FieldKey extends keyof Level> = {
  type: FieldType;
  component?: any;
  resetFormOnChange?: boolean;

  footer?: {
    description: string;
  }

  header?: {
    description?: string;
    title?: string;
    tooltip?: string;
  }

  /**
   * Optional width of the field. Defaults to full width
   */
  width?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

  /**
   * Optional placeholder
   */
  placeholder?: string;

  messages?: false | FieldMessagesFunction<Model>;

  status?: (payload: FieldMessageFunctionPayload<Model>) => {
    required?: boolean;
    disabled?: boolean;
    hidden?: boolean;
  }
}

type ISingleFieldBase<Model, Level, FieldKey extends keyof Level> = IFieldBase<Model, Level, FieldKey> & {
  value?: Level[FieldKey];
  validators?: ValidatorFn[];
  class?: string[];
}

export type IRepeatableField<Model, Level, FieldKey extends keyof Level> = IFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Repeatable;
  buttonLabel?: string;
  class?: string[];
  delete?: boolean;
  max?: number;
  fields: {
    [SubKey in keyof Level[FieldKey]]?: IField<Model, Level[FieldKey], SubKey>;
  }
}

export type ICheckboxField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Checkbox;
  option: Options;
}

export type ICheckboxesField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Checkbox;
  options: Options[];
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
  autofocus?: boolean;
}

export type IRadioField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Radio | FieldType.RadioButton;
  options: Options[];
}

export type IToggleField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Toggle;
  label: string;
}

export type ISelectField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Select;
  autoselectSingleOption?: boolean;
  options: Options[] | Observable<Options[]>;
  emptyOptionsText?: string;
}

export type ITextField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Date | FieldType.Email | FieldType.Number | FieldType.Text;
  autofocus?: boolean;
}

export type ITextareaField<Model, Level, FieldKey extends keyof Level> = ISingleFieldBase<Model, Level, FieldKey> & {
  type: FieldType.Textarea;
  rows?: number;
  autofocus?: boolean;
}

export type ISingleField<Model, Level, FieldKey extends keyof Level> =
  ICheckboxField<Model, Level, FieldKey> |
  ICheckboxesField<Model, Level, FieldKey> |
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

export type FormKitFormConfig<Model, Level = Model> = {
  transforms?: FormValueTransformFunction<Model>;
  fields: {
    [Key in keyof Level]?: IField<Model, Level, Key>;
  }
}

export type FormKitFormFieldListItem<T> = {
  name: Extract<keyof T, string>;
  field: IVisibleField<T, any, any>;
};
