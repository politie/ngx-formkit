import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayFieldComponent } from './array-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldIteratorPipe } from '../../pipes';
import { FormComponent } from '../form/form.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { MockComponent } from 'ng-mocks';

describe('ArrayFieldComponent', () => {
  let component: ArrayFieldComponent;
  let fixture: ComponentFixture<ArrayFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        MockComponent(FormFieldComponent),
        MockComponent(FormComponent),
        FieldIteratorPipe,
        ArrayFieldComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
