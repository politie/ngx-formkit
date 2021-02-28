import { FormControl, FormGroup } from '@angular/forms';
import { FieldType, IArrayField, IGroupField, IHiddenField, ISingleField } from '../models';

export const createFormGroupFromBlueprint = (field: IArrayField<any, any> | IGroupField<any, any>): FormGroup => {
  if (!field || !field.blueprint || typeof field.blueprint !== 'object' || (field.type !== FieldType.Array && field.type !== FieldType.Group)) {
    throw new Error(`FormKit: no 'field' or no 'Group | Array field' definition provided.`);
  }

  const obj: { [key: string]: FormControl } = {};

  for (const key of Object.keys(field.blueprint)) {
    const childField: ISingleField<any, any> | IHiddenField<any, any> = field.blueprint[key];
    obj[key] = childField.control();
  }

  return new FormGroup(obj);
};
