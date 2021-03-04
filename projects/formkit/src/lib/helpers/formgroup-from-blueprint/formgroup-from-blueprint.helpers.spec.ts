import { formGroupFromBlueprint } from './formgroup-from-blueprint.helpers';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldType } from '../../models';

describe('Create FormGroup from Blueprint helper', () => {
  const fieldError = 'FormKit: no \'field\' or no \'Group | Array field\' definition provided.';

  it('should throw error if field is not provided or blueprint is missing', () => {
    expect(() => formGroupFromBlueprint(null as any))
      .toThrowError(fieldError);

    expect(() => formGroupFromBlueprint({} as any))
      .toThrowError(fieldError);

    expect(() => formGroupFromBlueprint({ type: FieldType.Text, blueprint: {} } as any))
      .toThrowError(fieldError);

    expect(() => formGroupFromBlueprint({ blueprint: null } as any))
      .toThrowError(fieldError);

    expect(() => formGroupFromBlueprint({
      type: FieldType.Array,
      blueprint: {
        test: {
          type: FieldType.Text,
          value: 'testvalue'
        }
      }
    }))
      .not.toThrowError(fieldError);

    const group = formGroupFromBlueprint({
      type: FieldType.Array,
      blueprint: {
        test: {
          type: FieldType.Text,
          value: 'testvalue'
        },
        test2: {
          type: FieldType.Text,
          value: 'testvalue2'
        }
      }
    });

    expect(group).toBeInstanceOf(FormGroup);
    expect(Object.keys(group.controls).length).toEqual(2);
    expect(group.controls.test).toBeInstanceOf(FormControl);
    expect(group.controls.test.value).toEqual('testvalue');
    expect(group.controls.test2).toBeInstanceOf(FormControl);
    expect(group.controls.test2.value).toEqual('testvalue2');
  });
});
