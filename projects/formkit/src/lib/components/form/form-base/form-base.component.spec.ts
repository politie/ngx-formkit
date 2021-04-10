import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBaseComponent } from './form-base.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldType } from '../../../models';

describe('FormBaseComponent', () => {
  let component: FormBaseComponent<any>;
  let fixture: ComponentFixture<FormBaseComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [ FormBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBaseComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({});
    component.fields = {
      test: {
        type: FieldType.Text
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
