import { createFormGroupFromBlueprint } from './create-formgroup-from-blueprint.helpers';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldType } from '../models';

describe('Create FormGroup from Blueprint helper', () => {
  const fieldError = 'FormKit: no \'field\' or no \'Group | Array field\' definition provided.';

  it('should throw error if field is not provided or blueprint is missing', () => {
    expect(() => createFormGroupFromBlueprint(null as any))
      .toThrowError(fieldError);

    expect(() => createFormGroupFromBlueprint({} as any))
      .toThrowError(fieldError);

    expect(() => createFormGroupFromBlueprint({ type: FieldType.Text, blueprint: {} } as any))
      .toThrowError(fieldError);

    expect(() => createFormGroupFromBlueprint({ blueprint: null } as any))
      .toThrowError(fieldError);

    expect(() => createFormGroupFromBlueprint({
      type: FieldType.Array,
      blueprint: {
        test: {
          type: FieldType.Text,
          control: () => new FormControl('testvalue')
        }
      }
    }))
      .not.toThrowError(fieldError);

    const group = createFormGroupFromBlueprint({
      type: FieldType.Array,
      blueprint: {
        test: {
          type: FieldType.Text,
          control: () => new FormControl('testvalue')
        },
        test2: {
          type: FieldType.Text,
          control: () => new FormControl('testvalue2')
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
