import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordFieldComponent } from './password-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HumanizePipe } from '../../pipes';
import { MatIconModule } from '@angular/material/icon';

describe('PasswordFieldComponent', () => {
  let component: PasswordFieldComponent;
  let fixture: ComponentFixture<PasswordFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule
      ],
      declarations: [
        HumanizePipe,
        PasswordFieldComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the password visibility', () => {
    const spy = spyOn(component.togglePasswordVisibility, 'emit').and.callFake(() => {});

    expect(component.showPasswords).toEqual(false);

    component.onTogglePasswordVisibility();
    expect(component.showPasswords).toEqual(true);
    expect(spy).toHaveBeenCalled();

    component.onTogglePasswordVisibility();
    expect(component.showPasswords).toEqual(false);
    expect(spy).toHaveBeenCalled();
  });
});
