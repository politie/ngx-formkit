import { FieldIteratorPipe } from './field-iterator.pipe';
import { FieldType } from '../models';
import { FormControl } from '@angular/forms';

describe('Field Iterator Pipe', () => {
  const pipe = new FieldIteratorPipe();

  it('Should handle a set of fields', () => {
    const list = pipe.transform({
      test: {
        type: FieldType.Text,
        control: () => new FormControl()
      },
      test2: undefined
    });

    expect(list.length).toEqual(1);
    expect(list[0].key).toEqual('test');
    expect(list[0].value.type).toEqual(FieldType.Text);
  });

  it('Should handle undefined values', () => {
    const list = pipe.transform({
      test: undefined,
      test2: undefined
    });

    expect(list.length).toEqual(0);
  });
});
