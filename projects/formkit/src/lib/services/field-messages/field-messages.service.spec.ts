import { FormControl } from '@angular/forms';
import { FieldType, IVisibleField } from '../../models';
import { FieldMessagesService } from './field-messages.service';

describe('FieldMessagesService', () => {
  let service: FieldMessagesService;
  let control: FormControl;
  let field: IVisibleField<any, any, any>;

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
      service = new FieldMessagesService();
      control = new FormControl('test-value', null);
      field = {
        type: FieldType.Text
      };
    });

    it('should create', () => {
      expect(service).toBeInstanceOf(FieldMessagesService);
      expect(control.value).toEqual('test-value');
    });

    it('should handle updates, but should not call anything', () => {
      const spy = spyOn(service.list$, 'next').and.callThrough();
      service.updateVisibleMessages(control, field, { required: 'required' });
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
