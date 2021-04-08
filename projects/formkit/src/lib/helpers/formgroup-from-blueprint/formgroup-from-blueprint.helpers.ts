import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FieldType, IArrayField, IField, IGroupField } from '../../models';
import { createFormControl } from '../create-formcontrol/create-formcontrol.helpers';

export const formGroupFromBlueprint = (field: IArrayField<any, any, any> | IGroupField<any, any, any>): FormGroup => {
  if (!field || !field.blueprint || typeof field.blueprint !== 'object' || (field.type !== FieldType.Array && field.type !== FieldType.Group)) {
    throw new Error(`FormKit: no 'field' or no 'Group | Array field' definition provided.`);
  }

  const obj: { [key: string]: FormControl | FormArray | FormGroup } = {};

  for (const key of Object.keys(field.blueprint)) {
    const childField = field.blueprint[key] as IField<any, any, any>;

    if (childField.type === FieldType.Array) {
      obj[key] = new FormArray([ formGroupFromBlueprint(childField as unknown as IArrayField<any, any, any>)]);
    } else if (childField.type === FieldType.Group) {
      obj[key] = formGroupFromBlueprint(childField as unknown as IGroupField<any, any, any>);
    } else {
      obj[key] = createFormControl(childField.value, childField.validators);
    }
  }

  return new FormGroup(obj);
};
