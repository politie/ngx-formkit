import { Pipe, PipeTransform } from '@angular/core';
import { IField, ISingleField } from '../models/field.model';

/**
 * The Field Iterator Pipe takes a object of field definitions and transforms it to an array
 * so it plays nicely with *ngFor. This pipe is used in the following components:
 *
 * FormComponent
 * ArrayFieldComponent
 * GroupFieldComponent
 */
@Pipe({ name: 'fieldIterator' })
export class FieldIteratorPipe implements PipeTransform {
  transform(value: { [key: string]: IField<any, any> | ISingleField<any, any> | undefined}): { key: string, value: IField<any, any>}[] {
    const list: { key: string, value: IField<any, any>}[] = [];

    for(const key of Object.keys(value)) {
      if (typeof value[key] !== 'undefined') {
        list.push({ key, value: value[key] as IField<any, any> });
      }
    }

    return list;
  }
}
