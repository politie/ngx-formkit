import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldComponent } from './form-field.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { FieldMessageType, FieldType, FormEvent, ISingleField } from '../../models';
import { Subject } from 'rxjs';
import { RadioFieldComponent } from '../radio-field/radio-field.component';
import { MockProvider } from 'ng-mocks';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatRadioModule } from '@angular/material/radio';
import { FormFieldDirective } from '../../directives';

const field: ISingleField<any, any> = {
  type: FieldType.Radio,
  control: () => new FormControl(),
  options: [],
  transform: values => {
    if (values.testValue === 'test') {
      return 'new-value';
    } else {
      return undefined;
    }
  },
  messages: [
    {
      show: ({control}) => (control.value !== 'initial-value'),
      type: FieldMessageType.Information,
      text: (payload) => 'this is a information message'
    },
    {
      show: true,
      type: FieldMessageType.Warning,
      text: (payload) => 'this is a warning that must always show'
    }
  ]
};

describe('FieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserDynamicTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatIconModule,
        MatRadioModule
      ],
      declarations: [
        RadioFieldComponent,
        FormFieldComponent
      ],
      providers: [
        MockProvider(FormFieldDirective)
      ]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [RadioFieldComponent] }})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('initial-value');
    component.field = field as any;
    component.form = {
      components: {
        [FieldType.Radio]: RadioFieldComponent
      },
      fields: {},
      readonly: false,
      text: {
        loading: 'loading'
      },
      events$: new Subject<FormEvent>()
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show messages',  () => {
    const output = [];

    component.messages$.subscribe(r => {
      output.push(r);
    });

    component.updateMessages({ test: '123' });

    expect(output.length).toEqual(1);

    component.control.setValue('aapje', { onlySelf: true, emitEvent: false });
    component.control.markAsTouched();

    component.updateMessages({ test: '123 '});
    expect(output.length).toEqual(2);
  });

  it('should update the hidden state', () => {
    expect(component.field.hide).toBeFalsy();
    component.updateHiddenState(true);
    expect(component.field.hide).toEqual(true);
    component.updateHiddenState(false);
    expect(component.field.hide).toEqual(false);
  });

  it('should update the disabled state', () => {
    expect(component.control.enabled).toEqual(true);
    component.updateDisabledState(true);
    expect(component.control.enabled).toEqual(false);
    component.updateDisabledState(false);
    expect(component.control.enabled).toEqual(true);
  });

  it('should update the required state', () => {
    expect(component.control.errors).toEqual(null);
    component.control.setValue(null);
    component.updateRequiredState(true);
    expect(component.control.errors).toEqual({ required: true });
    component.updateRequiredState(false);
    expect(component.control.errors).toEqual(null);
  });

  it('should run onUpdateCompleted checks', () => {
    component.onAfterUpdateChecks({ testValue: 'test'});
    // Should have the transformed value
    expect(component.control.value).toEqual('new-value');
  });
});
