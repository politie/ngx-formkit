import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenFieldComponent } from './hidden-field.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('HiddenFieldComponent', () => {
  let component: HiddenFieldComponent;
  let fixture: ComponentFixture<HiddenFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        HiddenFieldComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
