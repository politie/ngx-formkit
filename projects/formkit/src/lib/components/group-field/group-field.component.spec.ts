import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFieldComponent } from './group-field.component';
import { FormkitModule } from '../../formkit.module';

describe('GroupFieldComponent', () => {
  let component: GroupFieldComponent;
  let fixture: ComponentFixture<GroupFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormkitModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
