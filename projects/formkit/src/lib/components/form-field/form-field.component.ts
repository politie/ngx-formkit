import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  HostBinding,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { FieldMessageType, FieldType } from '../../models/field.model';
import { extractEvents } from '../../helpers/extract-events/extract-events.helpers';
import { FormEvent, FormValues } from '../../models/form.model';
import { delay, distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';
import { FormFieldDirective } from '../../directives';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../config/config.token';
import { FormKitModuleConfig } from '../../models/config.model';
import { FieldBaseComponent } from '../field-base/field-base.component';
import { FormService } from '../../services/form.service';
import { IFormFieldComponent } from './form-field.component.model';
import { FormFieldState } from '../../classes/form-field-state/form-field-state.class';
import { FormFieldMessages } from '../../classes/form-field-messages/form-field-messages.class';

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
export class FormFieldComponent extends FieldBaseComponent implements IFormFieldComponent, OnInit {
  /**
   * Apply classes to the host component
   */
  @HostBinding('style.--column-span') get fieldWidth(): string {
    return this.field.width ? this.field.width.toString() : '12';
  };

  @HostBinding('class') get fieldClasses(): string {
    return [
      'formkit-field',
      (this.hidden) ? 'hidden' : ''
    ].filter(Boolean).join(' ');
  }

  /**
   * Serves as host for rendering the field components
   */
  @ViewChild(FormFieldDirective, { static: true }) fieldHost!: FormFieldDirective;

  FieldType = FieldType;
  FieldMessageType = FieldMessageType;

  formFieldState!: FormFieldState;
  formFieldMessages!: FormFieldMessages;

  private componentCdr!: ChangeDetectorRef;
  private hidden = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private cd: ChangeDetectorRef,
    private formService: FormService,
    @Inject(FORMKIT_MODULE_CONFIG_TOKEN) private config: Required<FormKitModuleConfig>
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.field || !this.control) {
      return;
    }

    /**
     * Set up the extension that handles the field messages
     */
    this.formFieldMessages = new FormFieldMessages(this.control, this.field);

    /**
     * Setup the extension that handles the field state updates (disabled, hidden, required)
     */
    this.formFieldState = new FormFieldState(this.control, this.field);

    /**
     * Sadly, this is needed, since @HostBinding doesn't support async / Observable streams
     * for setting class names:
     * https://github.com/angular/angular/issues/19483
     */
    this.formFieldState.visibilityChanges$.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(hide => this.hidden = hide);

    this.renderFieldComponent();
    this.setupOneTimeFormControlEventListener();
    this.setupFormEventListener();

    if (this.field.resetFormOnChange) {
      this.setupResetListener();
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

    const compRef = ref.createComponent<any>(factory);
    compRef.instance.control = this.control;
    compRef.instance.form = this.form;
    compRef.instance.field = this.field;
    compRef.instance.name = this.name;
    this.componentCdr = compRef.injector.get(ChangeDetectorRef);
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
   * Sets up a event listener for the form events$ observable.
   */
  setupFormEventListener() {
    this.formService.formEvents$.pipe(
      map<FormEvent, FormValues<any>>(event => event.values),
      takeUntil(this.destroy$)
    ).subscribe(values => {
      this.onAfterUpdateChecks(values);
    });
  }

  /**
   * Sets up a one time control listener to match messages with the current control state
   */
  setupOneTimeFormControlEventListener() {
    extractEvents(this.control).pipe(
      take(1),
      delay(10),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.formFieldMessages.updateVisibleMessages(this.form.getRawValue());

      if (this.componentCdr) {
        this.componentCdr.markForCheck();
      }
    });
  }

  /**
   * Checks to run after one of the fields in the form has changed.
   *
   * @param values the current (raw) values in the form
   */
  onAfterUpdateChecks(values: FormValues<any>) {
    if (typeof this.field.transform !== 'undefined') {
      const value = this.field.transform(values);

      if (typeof value !== 'undefined') {
        this.control.setValue(value, { emitEvent: false });
      }
    }

    /**
     * Update the field state (disabled, required, hidden)
     */
    this.formFieldState.updateFieldState(values);

    /**
     * Update the list of visible messages for this field
     */
    this.formFieldMessages.updateVisibleMessages(values);

    /**
     * Mark the component for check for the ChangeDetector
     */
    if (this.componentCdr) {
      this.componentCdr.markForCheck();
    }
  }
}
