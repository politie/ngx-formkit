import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldComponent } from './custom-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('CustomFieldComponent', () => {
  let component: CustomFieldComponent;
  let fixture: ComponentFixture<CustomFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        CustomFieldComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
