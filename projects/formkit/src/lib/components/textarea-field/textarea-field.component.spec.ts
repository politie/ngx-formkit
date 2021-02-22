import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaFieldComponent } from './textarea-field.component';
import { FormkitModule } from '../../formkit.module';
import { FormGroupDirective } from '@angular/forms';

describe('TextareaFieldComponent', () => {
  let component: TextareaFieldComponent;
  let fixture: ComponentFixture<TextareaFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormkitModule
      ],
      providers: [
        FormGroupDirective
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
