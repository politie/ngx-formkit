import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldComponent } from './form-field.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { FieldMessageType, FieldType, FormEvent, FormEventType, ISingleField } from '../../models';
import { Subject } from 'rxjs';
import { RadioFieldComponent } from '../radio-field/radio-field.component';
import { MockProvider } from 'ng-mocks';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatRadioModule } from '@angular/material/radio';
import { FormFieldDirective } from '../../directives';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../config';
import { FormKitModule } from '../../formkit.module';

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
  let events$: Subject<FormEvent>;
  let control: FormControl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserDynamicTestingModule,
        ReactiveFormsModule,
        FormKitModule,
        MatTooltipModule,
        MatIconModule,
        MatRadioModule
      ],
      providers: [
        {
          provide: FORMKIT_MODULE_CONFIG_TOKEN,
          useFactory: () => ({
            components: {
              [FieldType.Radio]: RadioFieldComponent,
            },
            text: {
              loading: 'loading'
            }
          })
        },
        MockProvider(FormFieldDirective)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    events$ = new Subject<FormEvent>();
    control = new FormControl('initial-value');

    component.formGroup = new FormGroup({ 'field-name': control });
    component.control = control;
    component.formEvents$ = events$;
    component.name = 'field-name';
    component.field = field as any;
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
    const spy = spyOn(component.visibilityChange, 'emit').and.callFake(() => {});
    expect(component.field.hide).toBeFalsy();
    component.updateHiddenState(true);
    expect(spy).toHaveBeenCalledWith({ name: 'field-name', hide: true });
    component.updateHiddenState(false);
    expect(spy).toHaveBeenCalledWith({ name: 'field-name', hide: false });
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

  it('should run onAfterUpdate checks', () => {
    component.onAfterUpdateChecks({ testValue: 'test'});
    // Should have the transformed value
    expect(component.control.value).toEqual('new-value');
  });

  it('should run checks after subject has emitted', () => {
    const spy = spyOn(component, 'onAfterUpdateChecks').and.callFake(() => {});

    events$.next({
      type: FormEventType.OnAfterUpdateChecks,
      values: {}
    });

    expect(spy).toHaveBeenCalled();
  });
});
