import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFieldComponent } from './text-field.component';
import { FormKitModule } from '../../formkit.module';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { FieldType } from '../../models';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;
  let fixture: ComponentFixture<TextFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
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
    component.form = new FormGroup({
      field: new FormControl()
    });
    component.name = 'field';
    component.field = {
      type: FieldType.Text
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
