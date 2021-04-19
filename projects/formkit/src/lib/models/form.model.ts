import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export type FormValues<T> = { [P in keyof T]?: T[P] };

export enum FormUpdateType {
  Init,
  User,
  Patch,
  Reset
}

export type Options = {
  id: any;
  label: string;
  description?: string;
  disabled?: boolean;
}

export enum FormEventType {
  OnAfterUpdateChecks,
  OnResetByControl
}

export type FormEvent = {
  type: FormEventType;
  values: FormValues<any>;
}

export type FormValueTransformFunction<T, A = T> = (values: T) => {
  [Key in Extract<keyof A, string>]?: A[Key] | undefined
};

type STATUS = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

/**
 * string is added only becouse Angular base class use string insted of union type
 * https://github.com/angular/angular/blob/7.2.7/packages/forms/src/model.ts#L196)
 */
type STATUSs = STATUS | string;

/**
 * OVERRIDE TYPES WITH STRICT TYPED INTERFACES + SOME TYPE TRICKS TO COMPOSE INTERFACE
 * (https://github.com/Microsoft/TypeScript/issues/16936)
 */
export interface IAbstractControl<T> extends AbstractControl {
  readonly value: T;
  valueChanges: Observable<T>;
  readonly status: STATUSs;
  statusChanges: Observable<STATUS>;
  get<V = unknown>(path: Array<string | number> | string): IAbstractControl<V> | null;
  setValue<V>(value: V extends T ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  patchValue<V>(value: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  reset<V>(value?: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

export interface IFormControl<T> extends FormControl {
  readonly value: T;
  valueChanges: Observable<T>;
  readonly status: STATUSs;
  statusChanges: Observable<STATUS>;
  get<V = unknown>(path: Array<string | number> | string): IAbstractControl<V> | null;
  setValue<V>(value: V extends T ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  patchValue<V>(value: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  reset<V>(value?: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

export interface IFormGroup<T> extends FormGroup {
  readonly value: T;
  readonly status: STATUSs;
  valueChanges: Observable<T>;
  controls: { [P in keyof T]: IAbstractControl<T[P]> };
  statusChanges: Observable<STATUS>;
  registerControl<P extends keyof T>(name: P, control: IAbstractControl<T[P]>): IAbstractControl<T[P]>;
  registerControl<V = any>(name: string, control: IAbstractControl<V>): IAbstractControl<V>;
  addControl<P extends keyof T>(name: P, control: IAbstractControl<T[P]>): void;
  addControl<V = any>(name: string, control: IAbstractControl<V>): void;
  removeControl(name: keyof T): void;
  removeControl(name: string): void;
  setControl<P extends keyof T>(name: P, control: IAbstractControl<T[P]>): void;
  setControl<V = any>(name: string, control: IAbstractControl<V>): void;
  contains(name: keyof T): boolean;
  contains(name: string): boolean;
  get<P extends keyof T>(path: P): IAbstractControl<T[P]>;
  get<V = unknown>(path: Array<string | number> | string): IAbstractControl<V> | null;
  getRawValue(): T & { [disabledProp in string | number]: any };
  setValue<V>(value: V extends T ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  patchValue<V>(value: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  reset<V>(value?: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

export interface IFormArray<T> extends FormArray {
  readonly value: T[];
  readonly status: STATUSs;
  valueChanges: Observable<T[]>;
  statusChanges: Observable<STATUS>;
  controls: IAbstractControl<T>[];
  at(index: number): IAbstractControl<T>;
  push<V = T>(ctrl: IAbstractControl<V>): void;
  insert<V = T>(index: number, control: IAbstractControl<V>): void;
  setControl<V = T>(index: number, control: IAbstractControl<V>): void;
  getRawValue(): T[];
  get<V = unknown>(path: Array<string | number> | string): IAbstractControl<V> | null;
  setValue<V>(value: V extends T[] ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  patchValue<V>(value: V extends Partial<T>[] ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  reset<V>(value?: V extends Partial<T>[] ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}
