import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatableFieldComponent } from './repeatable-field.component';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from '../form/form.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { MockComponent } from 'ng-mocks';
import { FieldType } from '../../models';
import { VisibleFieldKeysPipe } from '../../pipes/visible-field-keys.pipe';

describe('RepeatableFieldComponent', () => {
  let component: RepeatableFieldComponent;
  let fixture: ComponentFixture<RepeatableFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        VisibleFieldKeysPipe,
        MockComponent(FormFieldComponent),
        MockComponent(FormComponent),
        RepeatableFieldComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatableFieldComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      array: new FormArray([])
    });
    component.name = 'array';
    component.field = {
      type: FieldType.Repeatable,
      fields: {
        test: {
          type: FieldType.Text,
          value: 'test'
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
