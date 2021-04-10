import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedFormComponent } from './nested-form.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { FieldType } from '../../../models';

describe('SubFormComponent', () => {
  let component: NestedFormComponent;
  let fixture: ComponentFixture<NestedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        NestedFormComponent,
        MockComponent(FormFieldComponent)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedFormComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({});
    component.fields = {
      test: {
        type: FieldType.Text
      }
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.keys).toEqual(['test']);
  });
});
