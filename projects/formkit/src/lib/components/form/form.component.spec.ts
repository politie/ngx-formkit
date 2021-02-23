import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { MockComponent } from 'ng-mocks';
import { FieldType, IFormGroup } from '../../models';

type FormType = {
  value1: string;
  value2: string;
  value3: {
    input: string
  }[];
  value3edit: string[];
}

describe('FormComponent', () => {
  let component: FormComponent<FormType>;
  let fixture: ComponentFixture<FormComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
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
    component = fixture.componentInstance;

    component.fields = {
      value1: {
        type: FieldType.Text,
        control: () => new FormControl()
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

  it('should transform values and keys of the rawValues', () => {
    const spy = spyOn(component.form, 'getRawValue').and.callFake(() => ({
      value1: '123',
      value2: '456',
      value3: [{
        input: '123'
      }]
    }));

    const result = component.transformValues({
      omit: ['value2'],
      transform: values => ([
        {
          from: 'value3',
          to: { 'value3edit': values.value3.map((value: any) => value.input) }
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
