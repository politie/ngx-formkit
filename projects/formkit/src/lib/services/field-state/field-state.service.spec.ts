import { FormControl } from '@angular/forms';
import { FieldType, IVisibleField } from '../../models';
import { FieldStateService } from './field-state.service';

describe('FieldStateService', () => {
  let service: FieldStateService;
  let control: FormControl;
  let field: IVisibleField<any, any, any>;

  describe('Flow with state properties', () => {
    beforeEach(() => {
      service = new FieldStateService();
      control = new FormControl('test-value', null);
      field = {
        type: FieldType.Text,
        status: ({ values}) => ({
          hidden: values.hidden === 'hidden',
          disabled: values.disabled === 'disabled',
          required: values.required === 'required'
        })
      };
    });

    it('should create', () => {
      expect(service).toBeInstanceOf(FieldStateService);
    });

    it('should handle required updates', () => {
      const spy = spyOn(service, 'updateRequiredState').and.callThrough();

      service.updateFieldState(control, field, { required: 'required' });
      expect(spy).toHaveBeenCalledWith(control, true);

      service.updateFieldState(control, field, { required: 'not-required' });
      expect(spy).toHaveBeenCalledWith(control, false);
    });

    it('should handle disabled updates', () => {
      const spy = spyOn(service, 'updateDisabledState').and.callThrough();
      const enableSpy = spyOn(control, 'enable').and.callThrough();
      const disableSpy = spyOn(control, 'disable').and.callThrough();

      service.updateFieldState(control, field, { disabled: 'disabled' });
      expect(spy).toHaveBeenCalledWith(control, true);
      expect(enableSpy).toHaveBeenCalledTimes(0);
      expect(disableSpy).toHaveBeenCalledTimes(1);
      expect(control.disabled).toEqual(true);

      service.updateFieldState(control, field, { disabled: 'disabled' });
      expect(spy).toHaveBeenCalledWith(control, true);
      expect(enableSpy).toHaveBeenCalledTimes(0);
      expect(disableSpy).toHaveBeenCalledTimes(1);

      service.updateFieldState(control, field, { disabled: 'not-disabled' });
      expect(spy).toHaveBeenCalledWith(control, false);
      expect(enableSpy).toHaveBeenCalledTimes(1);
      expect(disableSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle visibility updates', () => {
      const spy = spyOn(service, 'updateHiddenState').and.callThrough();
      const changes: boolean[] = [];

      service.visibilityChanges$.subscribe(hide => changes.push(hide));

      service.updateFieldState(control, field, { hidden: 'hidden' });
      service.updateFieldState(control, field, { hidden: 'not-hidden' });
      service.updateFieldState(control, field, { hidden: 'hidden' });

      expect(spy).toHaveBeenCalledTimes(3);
      expect(changes).toEqual([true, false, true]);
    });
  });

  describe('Flow without state properties', () => {
    beforeEach(() => {
      service = new FieldStateService();
      control = new FormControl('test-value', null);
      field = {
        type: FieldType.Text
      };
    });

    it('should create', () => {
      expect(service).toBeInstanceOf(FieldStateService);
    });

    it('should handle updates, but should not call methods', () => {
      const requiredStateSpy = spyOn(service, 'updateRequiredState').and.callThrough();
      const hiddenStateSpy = spyOn(service, 'updateHiddenState').and.callThrough();
      const disabledStateSpy = spyOn(service, 'updateDisabledState').and.callThrough();
      service.updateFieldState(control, field, { required: 'required' });

      expect(requiredStateSpy).toHaveBeenCalledTimes(0);
      expect(hiddenStateSpy).toHaveBeenCalledTimes(0);
      expect(disabledStateSpy).toHaveBeenCalledTimes(0);
    });
  });
});
