import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioFieldComponent } from './radio-field.component';
import { FormKitModule } from '../../formkit.module';
import { FormGroupDirective } from '@angular/forms';

describe('RadioFieldComponent', () => {
  let component: RadioFieldComponent;
  let fixture: ComponentFixture<RadioFieldComponent>;

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
    fixture = TestBed.createComponent(RadioFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
