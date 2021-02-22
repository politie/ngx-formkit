import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonsFieldComponent } from './radio-buttons-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HumanizePipe } from '../../pipes';

describe('RadioButtonsFieldComponent', () => {
  let component: RadioButtonsFieldComponent;
  let fixture: ComponentFixture<RadioButtonsFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatIconModule
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
