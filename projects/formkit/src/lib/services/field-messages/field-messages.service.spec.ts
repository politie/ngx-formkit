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

    it('should handle a always active message', () => {
      let messages: FieldMessage[] = [];
      service.list$.subscribe(r => messages = [...messages, ...r]);

      service.updateVisibleMessages(control, field, {}, {});

      expect(messages.length).toEqual(1);
      expect(messages[0].text).toEqual('this is a warning that must always show');
    });

    it('should handle a message based on show()', () => {
      let messages: FieldMessage[] = [];
      service.list$.subscribe(r => messages = [...messages, ...r]);

      control.setValue('new-value');
      service.updateVisibleMessages(control, field, {}, {});

      expect(messages.length).toEqual(2);
      expect(messages[0].text).toEqual('this is a information message');
      expect(messages[1].text).toEqual('this is a warning that must always show');
    });

    it('should handle a message based on provided values', () => {
      let messages: FieldMessage[] = [];
      service.list$.subscribe(r => messages = [...messages, ...r]);

      control.setValue('new-value');
      service.updateVisibleMessages(control, field, { input3: 'input3' }, {});

      expect(messages.length).toEqual(3);
      expect(messages[0].text).toEqual('this is a information message');
      expect(messages[1].text).toEqual('this is a warning that must always show');
      expect(messages[2].text).toEqual('Message that shows when input3 value is input3');
    });

    it('should handle a message based on default messages', () => {
      let messages: FieldMessage[] = [];
      service.list$.subscribe(r => messages = [...messages, ...r]);

      control.setErrors({ 'testError': true });
      control.markAsTouched();

      service.updateVisibleMessages(control, field, {}, {
        'testError': 'This is the text from a default message'
      });

      expect(messages.length).toEqual(2);
      expect(messages[0].text).toEqual('This is the text from a default message');
      expect(messages[1].text).toEqual('this is a warning that must always show');
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
      let messages: FieldMessage[] = [];
      service.list$.subscribe(r => messages = [...messages, ...r]);
      service.updateVisibleMessages(control, field, { required: 'required' }, {});
      expect(messages.length).toEqual(0);
    });
  });
});
