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
import { delay, filter, map, share, takeUntil } from 'rxjs/operators';
import { FormFieldDirective } from '../../directives';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../config/config.token';
import { FormKitModuleConfig } from '../../models/config.model';
import { FieldBaseDirective } from '../../directives/field-base/field-base.directive';
import { FormService } from '../../services/form.service';
import { IFormFieldComponent } from './form-field.component.model';
import { AbstractControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { merge, Observable, of, zip } from 'rxjs';
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
    private cd: ChangeDetectorRef,
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
      filter(() => this.control.untouched),
      delay(10),
      map(() => this.rootControl instanceof FormGroup ? this.rootControl.getRawValue() : this.rootControl.value)
    );
  }

  private get valueChanges$(): Observable<FormValues<any>> {
    return merge(this.rootValueChanges$, this.oneTimeFormControlListener$).pipe(share());
  }

  private get visibleDefaultMessages$(): Observable<FieldMessage[]> {
    return this.valueChanges$.pipe(
      map(() => this.control.errors),
      map(errors => {
        if (!errors || (errors && this.control.untouched && !this.field.showMessagesIfControlIsUntouched)) {
          return [];
        }

        return Object.keys(errors).filter(s => this.config.messages[s]).map(error => {
          const message = this.config.messages[error];

          return {
            type: FieldMessageType.Error,
            text: (typeof message === 'string') ? message : message((this.control.errors as ValidationErrors)[error])
          };
        });
      })
    );
  }

  /**
   * Return the current visible messages for the field, based on the current values of
   * the rootControl. We want to make sure that even if there are no messages to show the
   * observable still emits, so we use the first map() operator to check if we need to
   * loop through the messages and if so, return the filtered list of messages (based
   * on the 'show' property on the message itself) to the next map() operator.
   */
  private get visibleMessages$(): Observable<FieldMessage[]> {
    return this.valueChanges$.pipe(
      /**
       * In the first stage, we get the custom messages for this field and filter them based on the show property
       */
      map(values => {
        if (!this.field.messages || (this.control.untouched && !this.field.showMessagesIfControlIsUntouched)) {
          return [];
        }

        return this.field.messages({
          control: this.control,
          errors: this.control.errors || {}, values
        }).filter(message => message.show);
      }),

      /**
       * Since we don't always know if a type is set on the message, map each custom message and add the
       * Information type if a type isn't set
       */
      map(messages => messages.map(({ type, text }) => ({
        type: type ? type : FieldMessageType.Information,
        text
      })))
    );
  }

  ngOnInit(): void {
    if (!this.field) {
      throw new TypeError(`FormKit - no [field] provided in <formkit-form-field> for field "${this.name}"`);
    }

    if (!this.name) {
      throw new TypeError(`FormKit - no [name] provided in <formkit-form-field> for field ${FieldType[this.field.type]}`);
    }

    if (!this.control) {
      throw new TypeError(`FormKit - no [control] provided in <formkit-form-field> for field "${this.name}" (${FieldType[this.field.type]})`);
    }

    this.standaloneField = Boolean(!this.formService);

    this.renderFieldComponent();

    if (this.field.resetFormOnChange && !this.standaloneField) {
      this.setupResetListener();
    }

    /**
     * If the field config is set to false,
     * just return and complete a empty stream.
     */
    if (this.field.messages === false) {
      this.messages$ = of([]);
    } else {
      /**
       * We need a combination of both the visible default messages
       * and the list of custom messages when they both have emitted (at least once),
       * so we use the zip operator.
       */
      this.messages$ = zip(this.visibleDefaultMessages$, this.visibleMessages$).pipe(
        map(([defaultMessages, customMessages]) => ([...defaultMessages, ...customMessages]))
      );
    }

    /**
     * If the field has the status property to set to update status
     * on a condition, pipe into the valueChanges$ observable and
     * use the values to update the field state.
     */
    if (this.field.status && typeof this.field.status === 'function') {
      this.valueChanges$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(values => {
        this.updateFieldStatus(values);
      });
    }

    /**
     * If there's a reference to the rendered field ChangeDetectorRef,
     * call on it valueChanges$ changes
     */
    if (this.componentCdr) {
      this.valueChanges$.pipe(takeUntil(this.destroy$)).subscribe(() => this.componentCdr.markForCheck());
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
