import { FormControl } from '@angular/forms';
import { FieldType } from '../../models';
import { FormFieldState } from './form-field-state.class';

describe('FormFieldState', () => {
  let instance: FormFieldState;

  describe('Flow with state properties', () => {
    beforeEach(() => {
      instance = new FormFieldState(new FormControl('test-value', null), {
        type: FieldType.Text,
        hidden: (values) => values.hidden === 'hidden',
        disabled: (values) => values.disabled === 'disabled',
        required: (values) => values.required === 'required'
      });
    });

    it('should create', () => {
      expect(instance).toBeInstanceOf(FormFieldState);
      expect(instance.control.value).toEqual('test-value');
    });

    it('should handle required updates', () => {
      const spy = spyOn(instance, 'updateRequiredState').and.callThrough();
      instance.updateFieldState({ required: 'required' });
      expect(spy).toHaveBeenCalledWith(true);

      instance.updateFieldState({ required: 'not-required' });
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should handle disabled updates', () => {
      const spy = spyOn(instance, 'updateDisabledState').and.callThrough();
      const enableSpy = spyOn(instance.control, 'enable').and.callThrough();
      const disableSpy = spyOn(instance.control, 'disable').and.callThrough();

      instance.updateFieldState({ disabled: 'disabled' });
      expect(spy).toHaveBeenCalledWith(true);
      expect(enableSpy).toHaveBeenCalledTimes(0);
      expect(disableSpy).toHaveBeenCalledTimes(1);
      expect(instance.control.disabled).toEqual(true);

      instance.updateFieldState({ disabled: 'disabled' });
      expect(spy).toHaveBeenCalledWith(true);
      expect(enableSpy).toHaveBeenCalledTimes(0);
      expect(disableSpy).toHaveBeenCalledTimes(1);

      instance.updateFieldState({ disabled: 'not-disabled' });
      expect(spy).toHaveBeenCalledWith(false);
      expect(enableSpy).toHaveBeenCalledTimes(1);
      expect(disableSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle visibility updates', () => {
      const spy = spyOn(instance, 'updateHiddenState').and.callThrough();
      const changes: boolean[] = [];

      instance.visibilityChanges$.subscribe(hide => changes.push(hide));

      instance.updateFieldState({ hidden: 'hidden' });
      instance.updateFieldState({ hidden: 'not-hidden' });
      instance.updateFieldState({ hidden: 'hidden' });

      expect(spy).toHaveBeenCalledTimes(3);
      expect(changes).toEqual([true, false, true]);
    });
  });

  describe('Flow without state properties', () => {
    beforeEach(() => {
      instance = new FormFieldState(new FormControl('test-value', null), {
        type: FieldType.Text
      });
    });

    it('should create', () => {
      expect(instance).toBeInstanceOf(FormFieldState);
      expect(instance.control.value).toEqual('test-value');
    });

    it('should handle updates, but should not call methods', () => {
      const requiredStateSpy = spyOn(instance, 'updateRequiredState').and.callThrough();
      const hiddenStateSpy = spyOn(instance, 'updateHiddenState').and.callThrough();
      const disabledStateSpy = spyOn(instance, 'updateDisabledState').and.callThrough();
      instance.updateFieldState({ required: 'required' });

      expect(requiredStateSpy).toHaveBeenCalledTimes(0);
      expect(hiddenStateSpy).toHaveBeenCalledTimes(0);
      expect(disabledStateSpy).toHaveBeenCalledTimes(0);
    });
  });
});
