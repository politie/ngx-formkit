import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FieldType, IRepeatableField, IField } from '../../models';
import { createFormControl } from '../create-formcontrol/create-formcontrol.helpers';

export const formGroupFromBlueprint = (field: IRepeatableField<any, any, any>): FormGroup => {
  if (!field || !field.fields || typeof field.fields !== 'object' || (field.type !== FieldType.Repeatable)) {
    throw new Error(`FormKit: no 'field' or no 'Group | Repeatable field' definition provided.`);
  }

  const obj: { [key: string]: FormControl | FormArray | FormGroup } = {};

  for (const key of Object.keys(field.fields)) {
    const childField = field.fields[key] as IField<any, any, any>;

    if (childField.type === FieldType.Repeatable) {
      obj[key] = new FormArray([ formGroupFromBlueprint(childField as unknown as IRepeatableField<any, any, any>) ]);
    } else {
      obj[key] = createFormControl(childField.value, childField.validators);
    }
  }

  return new FormGroup(obj);
};
