import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FormFieldComponent } from './form-field.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldMessageType, FieldType, FormEventType, ISingleField } from '../../models';
import { Subject } from 'rxjs';
import { RadioFieldComponent } from '../radio-field/radio-field.component';
import { MockProvider } from 'ng-mocks';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FormFieldDirective } from '../../directives';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../config';
import { FormKitModule } from '../../formkit.module';
import { FormService } from '../../services';

const field: ISingleField<any, any, any> = {
  type: FieldType.Radio,
  options: [],
  status: (payload) => ({
    required: payload.values.nonExist === true
  }),
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
        FormKitModule
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

  describe('standalone fields', () => {
    beforeEach(() => {
      TestBed.overrideProvider(FormService, { useValue: null });
      fixture = TestBed.createComponent(FormFieldComponent);
      component = fixture.componentInstance;
      component.control = new FormControl('initial-value');
      component.name = 'field-name';
      component.field = field as any;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should run checks after value change', fakeAsync(() => {
      const spy = spyOn(component, 'updateFieldStatus').and.callFake(() => {});
      component.control.setValue('1234');

      tick(500);
      expect(spy).toHaveBeenCalledWith('1234');
    }));
  });

  describe('FormKitForm fields', () => {
    beforeEach(() => {
      const group = new FormGroup({
        control: new FormControl('initial-value')
      });

      fixture = TestBed.createComponent(FormFieldComponent);
      component = fixture.componentInstance;
      service = TestBed.inject(FormService);
      component.control = (group.get('control') as FormControl);
      component.name = 'field-name';
      component.field = field as any;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should run checks after subject has emitted', () => {
      const spy = spyOn(component, 'updateFieldStatus').and.callFake(() => {});

      // @ts-ignore
      service.formEvents$.next({
        type: FormEventType.OnAfterUpdateChecks,
        values: {}
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});
