import { FormValues, Options } from './form.model';
import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

export enum FieldType {
  Hidden,
  Password,
  Text,
  Radio,
  RadioButton,
  Select,
  Checkbox,
  Textarea,
  Array,
  Group,
  Custom
}

type FieldMessageFunctionPayload<T> = {
  control: FormControl | FormArray | FormGroup,
  errors: ValidationErrors | null,
  values: FormValues<T>
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

export type FieldHookProperties<T> = {
  onInit?: (payload: FieldMessageFunctionPayload<T>) => void
}

type ConditionalFunction<T> = boolean | ((values: T) => boolean);

type IFieldBase<T, K extends keyof T> = {
  type: FieldType;
  value?: T[K];
  hooks?: FieldHookProperties<T>;
  component?: any;
  required?: ConditionalFunction<T>;
  disabled?: ConditionalFunction<T>;
  hidden?: ConditionalFunction<T>;
  transform?: (values: T) => T[K] | undefined;
  resetFormOnChange?: boolean;
  hide?: boolean;

  /**
   * Optional label. This description is placed as the 'label' above the field
   */
  label?: string;
  /**
   * Optional width of the field. Defaults to full width
   */
  width?: '1/2' | '1/3' | '2/3';

  /**
   * Optional title. This title is placed above the field
   */
  title?: string;

  /**
   * Optional description. This description is placed inside a <header> **above** the field
   */
  description?: string;

  tooltip?: string;
  messages?: FieldMessageProperties<T>[];
}

export type ICheckboxField<T, K extends keyof T> = IFieldBase<T, K> & {
  type: FieldType.Checkbox;
  option: Options;
}

export type IRadioField<T, K extends keyof T> = IFieldBase<T, K> & {
  type: FieldType.Radio | FieldType.RadioButton;
  options: Options[];
}

export type ISelectField<T, K extends keyof T> = IFieldBase<T, K> & {
  type: FieldType.Select;
  autoselectSingleOption?: boolean;
  options: Options[] | Observable<Options[]>;
  emptyOptionsText?: string;
}

export type ITextField<T, K extends keyof T> = IFieldBase<T, K> & {
  type: FieldType.Text;
  icon?: string;
}

export type ITextareaField<T, K extends keyof T> = IFieldBase<T, K> & {
  type: FieldType.Textarea;
  icon?: string;
  minRows?: number;
  maxRows?: number;
}

export type IPasswordField<T, K extends keyof T> = IFieldBase<T, K> & {
  type: FieldType.Password;
  icon?: string;
}

export type IHiddenField<T, K extends keyof T> = IFieldBase<T, K> & {
  type: FieldType.Hidden;
}

export type IArrayField<T, K extends keyof T> = IFieldBase<T, K> & {
  type: FieldType.Array;
  buttonLabel?: string
  maxLength?: number;
  blueprint: {
    [key: string]: ISingleField<T, any>;
  }
}

export type IGroupField<T, K extends keyof T> = IFieldBase<T, K> & {
  type: FieldType.Group;
  blueprint: {
    [key in keyof T[K]]: ISingleField<T, K>;
  }
}

export type ICustomField<T, K extends keyof T> = IFieldBase<T, K> & {
  type: FieldType.Custom;
  control: () => FormControl;
}

type ISingleFields<T, K extends keyof T> =
  ITextField<T, K> |
  ITextareaField<T, K> |
  IHiddenField<T, K> |
  IPasswordField<T, K> |
  IRadioField<T, K> |
  ICheckboxField<T, K> |
  ISelectField<T, K> |
  ICustomField<T, K>
;

export type ISingleField<T, K extends keyof T> = ISingleFields<T, K> & {
  control: () => FormControl;
}

export type IField<T, K extends keyof T> =
  ISingleField<T, K> |
  IArrayField<T, K> |
  IGroupField<T, K>
;

export type FormFields<T> = {
  [K in Extract<keyof T, string>]?: IField<T, K>;
};

export type FormKitFormFieldObservable<T> = {
  name: Extract<keyof T, string>;
  field$: BehaviorSubject<IField<T, any>>;
};
