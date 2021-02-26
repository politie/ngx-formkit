import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayFieldComponent } from './array-field.component';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from '../form/form.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { MockComponent } from 'ng-mocks';
import { FieldType } from '../../models';

describe('ArrayFieldComponent', () => {
  let component: ArrayFieldComponent;
  let fixture: ComponentFixture<ArrayFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        MockComponent(FormFieldComponent),
        MockComponent(FormComponent),
        ArrayFieldComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayFieldComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      array: new FormArray([])
    });
    component.name = 'array';
    component.field = {
      type: FieldType.Array,
      blueprint: {
        test: {
          type: FieldType.Text,
          control: () => new FormControl('test')
        }
      }
    };

    component.control = new FormArray([new FormGroup({
      test: new FormControl('initial')
    })]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a control', () => {
    expect(component.control.controls.length).toEqual(1);
    component.onAdd();
    expect(component.control.controls.length).toEqual(2);
    expect(component.control.controls[1]).toBeInstanceOf(FormGroup);
    expect(component.control.controls[1].value).toEqual({
      test: 'test'
    });
  });

  it('should remove controls', () => {
    expect(component.control.controls.length).toEqual(1);
    component.onAdd();
    component.onAdd();
    expect(component.control.controls.length).toEqual(3);

    component.onRemove(2);
    expect(component.control.controls.length).toEqual(2);

    component.onRemove(0);
    expect(component.control.controls.length).toEqual(1);

    expect(component.control.controls[0]).toBeInstanceOf(FormGroup);
    expect(component.control.controls[0].value).toEqual({
      test: 'test'
    });
  });
});
