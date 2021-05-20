import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleFieldComponent } from './toggle-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HumanizePipe } from '../../pipes';

describe('ToggleFieldComponent', () => {
  let component: ToggleFieldComponent;
  let fixture: ComponentFixture<ToggleFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        HumanizePipe,
        ToggleFieldComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
