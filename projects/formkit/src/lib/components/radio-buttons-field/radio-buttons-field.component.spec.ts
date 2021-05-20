import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonsFieldComponent } from './radio-buttons-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HumanizePipe } from '../../pipes';

describe('RadioButtonsFieldComponent', () => {
  let component: RadioButtonsFieldComponent;
  let fixture: ComponentFixture<RadioButtonsFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        HumanizePipe,
        RadioButtonsFieldComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
