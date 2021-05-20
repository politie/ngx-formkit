import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxFieldComponent } from './checkbox-field.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('CheckboxFieldComponent', () => {
  let component: CheckboxFieldComponent;
  let fixture: ComponentFixture<CheckboxFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        CheckboxFieldComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
