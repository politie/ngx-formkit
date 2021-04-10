import { FormControl } from '@angular/forms';
import { FieldType } from '../../models';
import { FormFieldMessages } from './form-field-messages.class';

describe('FormFieldMessages', () => {
  let instance: FormFieldMessages;

  // describe('Flow with state properties', () => {
  //   beforeEach(() => {
  //     instance = new FormFieldState(new FormControl('test-value', null), {
  //       type: FieldType.Text,
  //       hidden: (values) => values.hidden === 'hidden',
  //       disabled: (values) => values.disabled === 'disabled',
  //       required: (values) => values.required === 'required'
  //     });
  //   });
  // });

  describe('Flow without messages property', () => {
    beforeEach(() => {
      instance = new FormFieldMessages(new FormControl('test-value', null), {
        type: FieldType.Text
      });
    });

    it('should create', () => {
      expect(instance).toBeInstanceOf(FormFieldMessages);
      expect(instance.control.value).toEqual('test-value');
    });

    it('should handle updates, but should not call anything', () => {
      const spy = spyOn(instance.list$, 'next').and.callThrough();
      instance.updateVisibleMessages({ required: 'required' });
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});


// it('should show messages',  () => {
//   const output = [];
//
//   component.messages$.subscribe(r => {
//     output.push(r);
//   });
//
//   component.updateMessages({ test: '123' });
//
//   expect(output.length).toEqual(1);
//
//   component.control.setValue('test', { onlySelf: true, emitEvent: false });
//   component.control.markAsTouched();
//
//   component.updateMessages({ test: '123 '});
//   expect(output.length).toEqual(2);
// });
