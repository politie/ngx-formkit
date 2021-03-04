import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { MockComponent } from 'ng-mocks';
import { FieldType, IFormGroup } from '../../models';

type FormType = {
  value1: string;
  value2: string;
  value3: string;
  value3edit: string[];
}

describe('FormComponent', () => {
  let component: FormComponent<FormType>;
  let fixture: ComponentFixture<FormComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        MockComponent(FormFieldComponent),
        FormComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance as FormComponent<FormType>;
    component.autoCreate = false;

    component.fields = {
      value1: {
        type: FieldType.Text
      }
    };

    component.form = new FormGroup({
      value1: new FormControl('123'),
      value2: new FormControl('456'),
      value3: new FormArray([new FormGroup({
        input: new FormControl('123')
      })])
    }) as IFormGroup<any>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create if already created', () => {
    component.created = true;
    expect(() => component.create()).toThrowError('FormKit: Form is already created.');
  });

  describe('Possible [form] attribute errors', () => {
    const errorMesage = 'FormKit: <formkit-form> has no (valid) FormGroup set in [form] attribute.';

    it('should not create if no form prop is supplied', () => {
      component.form = null as any;
      expect(() => component.create()).toThrowError(errorMesage);
    });

    it('should not create if no formGroup is supplied', () => {
      component.form = new FormControl() as any;
      expect(() => component.create()).toThrowError(errorMesage);
    });
  });

  describe('Possible [fields] attribute errors', () => {
    const errorMessage = 'FormKit: <formkit-form> has no fields set in [fields] attribute.';
    beforeEach(() => {
      component.form = new FormGroup({});
    });

    it('should not create if no fields definition is supplied', () => {
      component.fields = null as any;
      expect(() => component.create()).toThrowError(errorMessage);
    });

    it('should not create if fields definition is empty', () => {
      component.fields = {} as any;
      expect(() => component.create()).toThrowError(errorMessage);
    });
  });

  describe('Create happy flow', () => {
    beforeEach(() => {
      component.form = new FormGroup({});
      component.fields = {
        value1: {
          type: FieldType.Text,
          value: 'testvalue'
        }
      };
    });

    it('should store the initial values', fakeAsync(() => {
      component.scheduler$.subscribe(r => {
        expect(r).toEqual({
          value1: 'testvalue'
        });
      });

      component.create();

      tick(25);

      expect(component.initialFormValues).toEqual({
        value1: 'testvalue'
      });

      expect(component.form.controls.value1.value).toEqual('testvalue');
    }));

    it('should patch values based on given object', fakeAsync(() => {
      component.scheduler$.subscribe(r => {
        expect(r).toEqual({
          value1: 'patched-value'
        });
      });

      component.create({ value1: 'patched-value' });

      tick(25);

      expect(component.form.controls.value1.value).toEqual('patched-value');
    }));

    it('should emit events if the form changes value', fakeAsync(() => {
      component.create();

      component.scheduler$.subscribe(r => {
        expect(r).toEqual({
          value1: 'patch-form-directly'
        });
      });

      component.form.patchValue({
        value1: 'patch-form-directly'
      });

      tick(25);
    }));
  });

  describe('Control with resetFormOnChange prop', () => {
    beforeEach(() => {
      component.form = new FormGroup({});
      component.fields = {
        value1: {
          type: FieldType.Text,
          resetFormOnChange: true
        },
        value2: {
          type: FieldType.Text
        },
        value3: {
          type: FieldType.Text,
          value: 'initial-value-3'
        }
      };
    });

    it('should run ValueChanges checks for this form', fakeAsync(() => {
      const spy = spyOn(component.form, 'reset').and.callThrough();

      component.create();

      component.scheduler$.subscribe(r => {
        expect(r).toEqual({
          value1: 'value-with-reset',
          value2: null,
          value3: 'initial-value-3'
        });
      });

      component.form.controls.value1.setValue('value-with-reset');

      tick(25);

      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('adding fields to the formGroup and populate fieldList', () => {
    beforeEach(() => {
      component.form = new FormGroup({});
      component.fields = {
        value1: {
          type: FieldType.Text,
          resetFormOnChange: true
        },
        value2: {
          type: FieldType.Text
        },
        value3: {
          type: FieldType.Text,
          value: 'initial-value-3'
        }
      };
    });

    it('should trigger the addControl function', () => {
      const spy = spyOn(component.form, 'addControl').and.callThrough();
      component.create();
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should populate the fieldList', () => {
      component.create();
      expect(component.fieldList.length).toEqual(3);
      expect(component.fieldList.map(i => i.name)).toEqual(['value1', 'value2', 'value3']);
    });
  });

  it('should transform values and keys of the rawValues', () => {
    const spy = spyOn(component.form, 'getRawValue').and.callFake(() => ({
      value1: '123',
      value2: '456',
      value3: '123'
    }));

    const result = component.transformValues({
      omit: ['value2'],
      transform: values => ([
        {
          from: 'value3',
          to: { 'value3edit': [values.value3] }
        },
        {
          from: 'value1',
          to: {
            'value1': `${values.value1}456`
          }
        }
      ])
    });

    expect(spy).toHaveBeenCalled();

    expect(result).toEqual({
      value1: '123456',
      value3edit: ['123']
    });
  });
});
