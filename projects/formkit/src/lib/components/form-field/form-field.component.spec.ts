import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

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
import { FormService } from '../../services';

const field: ISingleField<any, any, any> = {
  type: FieldType.Radio,
  options: [],
  messages: (payload) => ([
    {
      show: (payload.control.value !== 'initial-value'),
      type: FieldMessageType.Information,
      text: 'this is a information message'
    },
    {
      show: true,
      type: FieldMessageType.Warning,
      text: 'this is a warning that must always show'
    }
  ])
};

describe('FieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;
  let control: FormControl;
  let service: FormService;

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
          provide: FormService,
          useValue: {
            formEvents$: new Subject()
          }
        },
        {
          provide: FORMKIT_MODULE_CONFIG_TOKEN,
          useFactory: () => ({
            components: {
              [FieldType.Radio]: RadioFieldComponent
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
    service = TestBed.inject(FormService);
    control = new FormControl('initial-value');

    component.form = new FormGroup({ 'field-name': control });
    component.control = control;
    component.name = 'field-name';
    component.field = field as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run onAfterUpdate checks', () => {
    component.onAfterUpdateChecks({ testValue: 'test'});
    expect(component.control.value).toEqual('initial-value');
  });

  it('should run checks after subject has emitted', () => {
    const spy = spyOn(component, 'onAfterUpdateChecks').and.callFake(() => {});

    // @ts-ignore
    service.formEvents$.next({
      type: FormEventType.OnAfterUpdateChecks,
      values: {}
    });

    expect(spy).toHaveBeenCalled();
  });
});
