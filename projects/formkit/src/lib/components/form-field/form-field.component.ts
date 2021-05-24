import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  Inject,
  OnInit,
  Optional,
  ViewChild
} from '@angular/core';
import { FieldMessage, FieldMessageType, FieldType } from '../../models/field.model';
import { extractEvents } from '../../helpers/extract-events/extract-events.helpers';
import { FormEvent, FormValues } from '../../models/form.model';
import { delay, map, take, takeUntil } from 'rxjs/operators';
import { FormFieldDirective } from '../../directives';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../config/config.token';
import { FormKitModuleConfig } from '../../models/config.model';
import { FieldBaseDirective } from '../../directives/field-base/field-base.directive';
import { FormService } from '../../services/form.service';
import { IFormFieldComponent } from './form-field.component.model';
import { AbstractControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { merge, Observable, of } from 'rxjs';
import { mergeError, removeError } from '../../helpers';

/**
 * Since NgPackagr will complain about Required (which exists in Typescript), we add
 * the @dynamic decorator right here to let the build --prod pass.
 */
// @dynamic
@Component({
  selector: 'formkit-form-field',
  templateUrl: './form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent extends FieldBaseDirective implements IFormFieldComponent, OnInit {
  /**
   * Apply classes to the host component
   */
  @HostBinding('style.--column-span') get fieldWidth(): string {
    return this.field?.width ? this.field.width.toString() : '12';
  };

  @HostBinding('class') get fieldClasses(): string {
    return [
      'formkit-field',
      (this.control.disabled) ? 'is-disabled' : '',
      (this.hidden) ? 'hidden' : '',
      (this.field?.class) ? this.field.class.join(' ') : ''
    ].filter(Boolean).join(' ');
  }

  /**
   * Serves as host for rendering the field components
   */
  @ViewChild(FormFieldDirective, { static: true }) fieldHost!: FormFieldDirective;

  FieldType = FieldType;
  FieldMessageType = FieldMessageType;
  componentRef!: ComponentRef<any>;
  messages$!: Observable<FieldMessage[]>;

  private componentCdr!: ChangeDetectorRef;
  private hidden = false;
  private standaloneField = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    @Optional() private formService: FormService,
    @Inject(FORMKIT_MODULE_CONFIG_TOKEN) private config: Required<FormKitModuleConfig>
  ) {
    super();
  }

  private get rootControl(): AbstractControl {
    return this.control.root;
  }

  /**
   * Get either the observable of the rootControl (if the field is a standalone) or
   * pipe into the formEvents$ observable for the valueChanges of the root control (FormGroup)
   *
   * @private
   */
  private get rootValueChanges$(): Observable<FormValues<any>> {
    if (this.standaloneField) {
      return this.rootControl.valueChanges;
    } else {
      return this.formService.formEvents$.pipe(map<FormEvent, FormValues<any>>(event => event.values));
    }
  }

  /**
   * We need a one time listener in order to respond to the untouched > touched change
   * and update the status + messages accordingly.
   *
   * @private
   */
  private get oneTimeFormControlListener$(): Observable<FormValues<any>> {
    return extractEvents(this.control).pipe(
      take(1),
      delay(10),
      map(() => this.rootControl instanceof FormGroup ? this.rootControl.getRawValue() : this.rootControl.value)
    );
  }

  private get rootAndFormControlValueChanges$(): Observable<FormValues<any>> {
    return merge(this.rootValueChanges$, this.oneTimeFormControlListener$);
  }

  ngOnInit(): void {
    if (!this.control) {
      throw new Error(`FormKit - no FormControl provided in <formkit-form-field> [control] attribute for field "${this.name || ''}"`);
    }

    if (!this.field) {
      throw new Error(`FormKit - no Field config provided in <formkit-form-field> [field] attribute property for field "${this.name || ''}"`);
    }

    this.standaloneField = Boolean(!this.formService);

    this.renderFieldComponent();

    if (this.field.resetFormOnChange && !this.standaloneField) {
      this.setupResetListener();
    }

    this.messages$ = this.createMessagesObservable();

    /**
     * If the field has the status property to set to update status
     * on a condition, pipe into the valueChanges$ observable and
     * use the values to update the field state.
     */
    if (this.field.status && typeof this.field.status === 'function') {
      this.rootAndFormControlValueChanges$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(values => this.updateFieldStatus(values));
    }
  }

  /**
   * Create a observable with messages for this field.
   * We check the stream of valueChanges (either based on the FormService or root control)
   * and a one time listener to handle the first focus lost event.
   */
  createMessagesObservable(): Observable<FieldMessage[]> {
    if (this.field.messages === false) {
      /**
       * User doesn't want to have messages for this field,
       * just return and complete a empty stream.
       */
      return of([]);
    } else {
      return this.rootAndFormControlValueChanges$.pipe(
        map(values => ([
          ...this.getVisibleDefaultMessages(),
          ...this.getVisibleCustomMessages(values)
        ]))
      );
    }
  }

  /**
   * Create a component by getting a specific defined component for this field, or get it from the list of global components
   * defined in the form
   */
  renderFieldComponent() {
    const factory = this.resolver.resolveComponentFactory(this.field.component || this.config.components[this.field.type]);
    const ref = this.fieldHost.viewContainerRef;
    ref.clear();

    this.componentRef = ref.createComponent<any>(factory);
    this.componentRef.instance.control = this.control;
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.name = this.name;
    this.componentCdr = this.componentRef.injector.get(ChangeDetectorRef);
  }

  /**
   * Create a listener to reset the entire form when this form field changes
   * This applies only to controls with teh 'resetFormOnChange' property
   */
  setupResetListener() {
    this.control.valueChanges.pipe(
      map(value => ({ [this.name]: value })),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.formService.triggerFormResetByControl(value);
    });
  }

  /**
   * Returns the default messages that should be visible for the field based on the errors of the associated control
   */
  getVisibleDefaultMessages(): FieldMessage[] {
    if (this.control.errors && (this.control.touched || this.field.showMessagesIfControlIsUntouched)) {
      return Object.keys(this.control.errors).filter(s => this.config.messages[s]).map(error => {
        const message = this.config.messages[error];

        return {
          type: FieldMessageType.Error,
          text: (typeof message === 'string') ? message : message((this.control.errors as ValidationErrors)[error])
        };
      });
    }

    return [];
  }

  /**
   * Return the current visible messages for the field, based on the current values of
   * the rootControl.
   *
   * @param values
   */
  getVisibleCustomMessages(values: FormValues<any>): FieldMessage[] {
    if (this.field.messages && (this.control.touched || this.field.showMessagesIfControlIsUntouched)) {
      const callbackPayload = { control: this.control, errors: this.control.errors || {}, values};

      return this.field.messages(callbackPayload)
        .filter(m => m.show)
        .map(({ type, text }) => ({ type: type ? type : FieldMessageType.Information, text }));
    }

    return [];
  }

  /**
   * Gets called if the field configuration has a `status` property set and
   * when the valueChanges$ observable emits. Based on the result of the callback,
   * we update the three statuses (hidden, disabled, required).
   *
   * @param values
   */
  updateFieldStatus(values: FormValues<any>): void {
    const result = (this.field.status as any)({ control: this.control, errors: this.control.errors || {}, values });

    if (typeof result.hidden !== 'undefined' && this.hidden !== result.hidden) {
      this.updateHiddenStatus(result.hidden);
    }

    if (typeof result.disabled !== 'undefined') {
      this.updateDisabledStatus(result.disabled);
    }

    if (typeof result.required !== 'undefined') {
      this.updateRequiredStatus(result.required);
    }
  }

  private updateHiddenStatus(match: boolean) {
    this.hidden = match;
  }

  private updateDisabledStatus(match: boolean) {
    if (match && this.control.enabled) {
      this.control.disable({onlySelf: true, emitEvent: false});
    } else if (!match && this.control.disabled) {
      this.control.enable({onlySelf: true, emitEvent: false});
    }
  }

  /**
   * We use the mergeError / removeError helpers to make sure that
   * other errors on the control aren't removed when removing or adding the
   * required error.
   *
   * @param match boolean to indicate if the control is required
   * @private
   */
  private updateRequiredStatus(match: boolean) {
    if (match) {
      this.control.setErrors(mergeError(this.control.errors, Validators.required(this.control)));
    } else {
     this.control.setErrors(removeError(this.control.errors, 'required'));
    }
  }
}
