import { Pipe, PipeTransform } from '@angular/core';
import { FieldType, IField } from '../models';

@Pipe({ name: 'visibleFieldKeys' })
export class VisibleFieldKeysPipe implements PipeTransform {
  transform(object: { [key: string]: IField<any, any, any> }): string[] {
    console.log(Object.keys(object).filter(k => object[k].type !== FieldType.Hidden));

    return Object.keys(object).filter(k => object[k].type !== FieldType.Hidden);
  }
}
