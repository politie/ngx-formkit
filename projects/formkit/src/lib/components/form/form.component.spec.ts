import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { MockComponent } from 'ng-mocks';
import { FieldType, FormUpdateType, IFormGroup } from '../../models';
import { FORMKIT_MODULE_CONFIG_TOKEN, FORMKIT_MODULE_DEFAULT_CONFIG } from '../../config';
import { FormService } from '../../services';
import { VisibleFieldKeysPipe } from '../../pipes/visible-field-keys.pipe';

type FormType = {
  value1: string;
  value2: string;
  value3: {
    input: string;
  };
}

describe('FormComponent', () => {
  let component: FormComponent<FormType>;
  let fixture: ComponentFixture<FormComponent<any>>;
  let service: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        VisibleFieldKeysPipe,
        MockComponent(FormFieldComponent),
        FormComponent
      ],
      providers: [
        FormService,
        {
          provide: FORMKIT_MODULE_CONFIG_TOKEN,
          useValue: FORMKIT_MODULE_DEFAULT_CONFIG
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance as FormComponent<FormType>;
    service = TestBed.inject(FormService);

    component.config = {
      fields: {
        value1: {
          type: FieldType.Text
        }
      }
    };

    component.form = new FormGroup({
      value1: new FormControl('123'),
      value2: new FormControl('456'),
      value3: new FormArray([new FormGroup({
        input: new FormControl('123')
      })])
    }) as IFormGroup<any>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create if already created', () => {
    component.created = true;
    expect(() => component.ngOnInit()).toThrowError('FormKit: Form is already created.');
  });

  describe('Possible [form] attribute errors', () => {
    const errorMessage = 'FormKit: <formkit-form> has no (valid) FormGroup set in [form] attribute.';

    it('should not create if no form prop is supplied', () => {
      component.form = null as any;
      expect(() => component.ngOnInit()).toThrowError(errorMessage);
    });

    it('should not create if no formGroup is supplied', () => {
      component.form = new FormControl() as any;
      expect(() => component.ngOnInit()).toThrowError(errorMessage);
    });
  });

  describe('Possible [config] attribute errors', () => {
    const errorMessage = 'FormKit: <formkit-form> has no config set in [config] attribute.';
    beforeEach(() => {
      component.form = new FormGroup({});
    });

    it('should not create if no fields definition is supplied', () => {
      component.config = null as any;
      expect(() => component.ngOnInit()).toThrowError(errorMessage);
    });

    it('should not create if no fields definition is supplied', () => {
      component.config = { } as any;
      expect(() => component.ngOnInit()).toThrowError(errorMessage);
    });

    it('should not create if fields definition is empty', () => {
      component.config = { fields: {} } as any;
      expect(() => component.ngOnInit()).toThrowError('FormKit: <formkit-form> has no fields set in the [config] attribute');
    });
  });

  describe('Create happy flow', () => {
    beforeEach(() => {
      component.form = new FormGroup({});
      component.config = {
        fields: {
          value1: {
            type: FieldType.Text,
            value: 'testvalue'
          }
        }
      };
      fixture.detectChanges();
    });

    it('should store the initial values', fakeAsync(() => {
      component.transformedValues$.subscribe(r => {
        expect(r).toEqual({
          value1: 'testvalue'
        });
      });

      tick(25);

      expect(component.initialFormValues).toEqual({
        value1: 'testvalue'
      });

      expect(component.form.controls.value1.value).toEqual('testvalue');
    }));

    it('should emit events if the form changes value', fakeAsync(() => {
      component.patch({
        value1: 'patch-form-directly'
      });

      tick(25);

      expect(component.form.getRawValue()).toEqual({
        value1: 'patch-form-directly'
      });
    }));
  });

  describe('Control with resetFormOnChange prop', () => {
    beforeEach(() => {
      component.form = new FormGroup({});
      component.config = {
        fields: {
          value1: {
            type: FieldType.Text,
            resetFormOnChange: true
          },
          value2: {
            type: FieldType.Text
          },
          value3: {
            type: FieldType.Repeatable,
            fields: {
              input: {
                type: FieldType.Text,
                value: 'initial-value-3'
              }
            }
          }
        }
      };
    });

    it('should run ValueChanges checks for this form', fakeAsync(() => {
      fixture.detectChanges();
      component.formUpdateType = FormUpdateType.User;

      const spy = spyOn(component.form, 'reset').and.callThrough();
      component.formService.triggerFormResetByControl({ value1: 'value-with-reset' });

      tick();

      expect(spy).toHaveBeenCalled();

      expect(component.form.getRawValue()).toEqual({
        value1: 'value-with-reset',
        value2: null,
        value3: [{ input: 'initial-value-3' }]
      });
    }));
  });

  describe('adding fields to the formGroup and populate fieldList', () => {
    beforeEach(() => {
      component.form = new FormGroup({});
      component.config = {
        fields: {
          value1: {
            type: FieldType.Text,
            resetFormOnChange: true
          },
          value2: {
            type: FieldType.Hidden
          },
          value3: {
            type: FieldType.Repeatable,
            fields: {
              input: {
                type: FieldType.Text
              }
            }
          }
        }
      };
    });

    it('should trigger the addControl function', () => {
      const spy = spyOn(component.form, 'addControl').and.callThrough();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Transform values function', () => {

    beforeEach(() => {
      component.form = new FormGroup({});
      component.config = {
        fields: {
          value1: {
            type: FieldType.Text
          },
          value2: {
            type: FieldType.Text
          },
          value3: {
            type: FieldType.Repeatable,
            fields: {
              input: {
                type: FieldType.Text,
                value: 'initial-value-3'
              }
            }
          }
        }
      };
    });

    it('should handle empty transform', () => {
      component.config.transforms = () => ({});
      fixture.detectChanges();

      const transformed = component.transformFormValuesByFormTransformFunction(component.form.getRawValue());
      expect(transformed).toEqual({
        value1: null,
        value2: null,
        value3: [{ input: 'initial-value-3' }]
      });
    });

    it('should handle undefined transform', () => {
      component.config.transforms = (values) => ({
        value2: values.value1 === 'test-value-1' ? 'transformed-value-2' : undefined,
        value3: values.value1 === 'test-value-1' ? { input: 'transformed-value-3' } : undefined
      });

      fixture.detectChanges();

      const spy = spyOn(component.form.controls.value2, 'setValue').and.callThrough();

      expect(component.transformFormValuesByFormTransformFunction(component.form.getRawValue())).toEqual({
        value1: null,
        value2: null,
        value3: [{ input: 'initial-value-3' }]
      });

      expect(spy).toHaveBeenCalledTimes(0);

      component.form.controls.value1.setValue('test-value-1');

      expect(component.transformFormValuesByFormTransformFunction(component.form.getRawValue())).toEqual({
        value1: 'test-value-1',
        value2: 'transformed-value-2',
        value3: [{ input: 'transformed-value-3' }]
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('transformed-value-2', { emitEvent: false, onlySelf: true });
    });

    it('should handle shorthand transform', () => {
      component.config.transforms = (values) => ({
        ...(values.value1 === 'test-value-1' && { value2: 'transformed-value-2' })
      });

      fixture.detectChanges();

      const spy = spyOn(component.form.controls.value2, 'setValue').and.callThrough();

      expect(component.transformFormValuesByFormTransformFunction(component.form.getRawValue())).toEqual({
        value1: null,
        value2: null,
        value3: [{ input: 'initial-value-3' }]
      });

      expect(spy).toHaveBeenCalledTimes(0);

      component.form.controls.value1.setValue('test-value-1');

      expect(component.transformFormValuesByFormTransformFunction(component.form.getRawValue())).toEqual({
        value1: 'test-value-1',
        value2: 'transformed-value-2',
        value3: [{ input: 'initial-value-3' }]
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('transformed-value-2', { emitEvent: false, onlySelf: true });
    });
  });
});
