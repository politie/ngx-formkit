import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFieldComponent } from './text-field.component';
import { FormKitModule } from '../../formkit.module';
import { FormGroupDirective } from '@angular/forms';

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;
  let fixture: ComponentFixture<TextFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormKitModule
      ],
      providers: [
        FormGroupDirective
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
