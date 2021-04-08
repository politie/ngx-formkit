import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { MockComponent } from 'ng-mocks';
import { FieldType, IFormGroup } from '../../../models';
import { FORMKIT_MODULE_CONFIG_TOKEN, FORMKIT_MODULE_DEFAULT_CONFIG } from '../../../config';

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
      ],
      providers: [
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

  describe('Possible [fields] attribute errors', () => {
    const errorMessage = 'FormKit: <formkit-form> has no fields set in [fields] attribute.';
    beforeEach(() => {
      component.form = new FormGroup({});
    });

    it('should not create if no fields definition is supplied', () => {
      component.fields = null as any;
      expect(() => component.ngOnInit()).toThrowError(errorMessage);
    });

    it('should not create if fields definition is empty', () => {
      component.fields = {} as any;
      expect(() => component.ngOnInit()).toThrowError(errorMessage);
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
      fixture.detectChanges();
    });

    it('should store the initial values', fakeAsync(() => {
      component.scheduler$.subscribe(r => {
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
      fixture.detectChanges();
      const spy = spyOn(component.form, 'reset').and.callThrough();

      component.form.controls.value1.setValue('value-with-reset');

      tick(25);

      expect(component.form.getRawValue()).toEqual({
        value1: 'value-with-reset',
        value2: null,
        value3: 'initial-value-3'
      });

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
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should populate the fieldList', () => {
      fixture.detectChanges();
      expect(component.fieldList.length).toEqual(3);
      expect(component.fieldList.map(i => i.name)).toEqual(['value1', 'value2', 'value3']);
    });
  });
});
