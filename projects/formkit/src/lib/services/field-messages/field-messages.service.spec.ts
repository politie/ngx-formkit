import { FormControl } from '@angular/forms';
import { FieldMessage, FieldMessageType, FieldType, IVisibleField } from '../../models';
import { FieldMessagesService } from './field-messages.service';

describe('FieldMessagesService', () => {
  let service: FieldMessagesService;
  let control: FormControl;
  let field: IVisibleField<any, any, any>;

  describe('Flow with messages property', () => {
    beforeEach(() => {
      service = new FieldMessagesService();
      control = new FormControl('test-value', null);
      field = {
        type: FieldType.Text,
        messages: [
          {
            show: payload => {
              return (payload.control.value !== 'test-value');
            },
            type: FieldMessageType.Information,
            text: 'this is a information message'
          },
          {
            show: true,
            type: FieldMessageType.Warning,
            text: 'this is a warning that must always show'
          },
          {
            show: payload => payload.values.input3 === 'input3',
            text: 'Message that shows when input3 value is input3'
          }
        ]
      };
    });

    it('should create', () => {
      expect(service).toBeInstanceOf(FieldMessagesService);
      expect(control.value).toEqual('test-value');
    });

    it('should handle updates on messages', () => {
      const messages: FieldMessage[][] = [];
      service.list$.subscribe(r => messages.push(r));

      // control.setValue('new-value');
      service.updateVisibleMessages(control, field, {});

      expect(messages[0].length).toEqual(1);
      expect(messages[0][0].text).toEqual('this is a warning that must always show');

      control.setValue('new-value');
      service.updateVisibleMessages(control, field, {});

      expect(messages[1].length).toEqual(2);
      expect(messages[1][0].text).toEqual('this is a information message');
      expect(messages[1][1].text).toEqual('this is a warning that must always show');

      service.updateVisibleMessages(control, field, { input3: 'input3' });

      expect(messages[2].length).toEqual(3);
      expect(messages[2][0].text).toEqual('this is a information message');
      expect(messages[2][1].text).toEqual('this is a warning that must always show');
      expect(messages[2][2].text).toEqual('Message that shows when input3 value is input3');
    });
  });

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
