import { createFormControl } from './create-formcontrol.helpers';
import { FormControl, Validators } from '@angular/forms';

describe('FormControl helper', () => {

  it('should return a plain FormControl', () => {
    const control = createFormControl();
    expect(control).toBeInstanceOf(FormControl);
    expect(control.value).toEqual(null);
    expect(control.validator).toEqual(null);
  });

  it('should return a FormControl with value', () => {
    const control = createFormControl('test-value');
    expect(control.value).toEqual('test-value');
    expect(control.validator).toEqual(null);
  });

  it('should return a FormControl with value and validators', () => {
    const control = createFormControl('test-value', [Validators.required]);
    expect(control.value).toEqual('test-value');
    expect(control.validator?.length).toEqual(1);
  });
});
