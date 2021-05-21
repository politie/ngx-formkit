import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  Inject,
  OnInit, Optional,
  ViewChild
} from '@angular/core';
import { FieldMessageType, FieldType } from '../../models/field.model';
import { extractEvents } from '../../helpers/extract-events/extract-events.helpers';
import { FormEvent, FormValues } from '../../models/form.model';
import { delay, distinctUntilChanged, map, subscribeOn, take, takeUntil } from 'rxjs/operators';
import { FormFieldDirective } from '../../directives';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../config/config.token';
import { FormKitModuleConfig } from '../../models/config.model';
import { FieldBaseDirective } from '../../directives/field-base/field-base.directive';
import { FormService } from '../../services/form.service';
import { IFormFieldComponent } from './form-field.component.model';
import { FieldStateService } from '../../services/field-state/field-state.service';
import { FieldMessagesService } from '../../services/field-messages/field-messages.service';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * Since NgPackagr will complain about Required (which exists in Typescript), we add
 * the @dynamic decorator right here to let the build --prod pass.
 */
// @dynamic
@Component({
  selector: 'formkit-form-field',
  templateUrl: './form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FieldMessagesService,
    FieldStateService
  ]
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

  private componentCdr!: ChangeDetectorRef;
  private hidden = false;
  private standaloneField = false;

  constructor(
    public fieldMessagesService: FieldMessagesService,
    public fieldStateService: FieldStateService,
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

  ngOnInit(): void {
    if (!this.control) {
      throw new Error(`FormKit - no FormControl provided in <formkit-form-field> [control] attribute for field "${this.name || ''}"`);
    }

    if (!this.field) {
      throw new Error(`FormKit - no Field config provided in <formkit-form-field> [field] attribute property for field "${this.name || ''}"`);
    }

    this.standaloneField = Boolean(!this.formService);

    /**
     * Sadly, this is needed, since @HostBinding doesn't support async / Observable streams
     * for setting class names:
     * https://github.com/angular/angular/issues/19483
     */
    this.fieldStateService.visibilityChanges$.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(hide => this.hidden = hide);

    this.renderFieldComponent();
    this.setupOneTimeFormControlEventListener();

    if (this.standaloneField) {
      this.setupStandaloneEventListener();
    } else {
      this.setupFormEventListener();
    }

    if (this.field.resetFormOnChange && !this.standaloneField) {
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
   * Setup root control listener for standalone controls
   * https://angular.io/api/forms/AbstractControl#root
   */
  setupStandaloneEventListener() {
    if (this.rootControl) {
      this.rootControl.valueChanges.pipe(
        takeUntil(this.destroy$)
      ).subscribe(values => {
        this.onAfterUpdateChecks(values);
      });
    }
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
      if (this.field.messages !== false) {
        this.fieldMessagesService.updateVisibleMessages({
          control: this.control,
          defaultMessages: this.config.messages,
          field: this.field,
          values: this.rootControl instanceof FormGroup ? this.rootControl.getRawValue() : this.rootControl.value
        });
      }

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
    /**
     * Update the field state (disabled, required, hidden)
     */
    this.fieldStateService.updateFieldState(this.control, this.field, values);

    /**
     * Update the list of visible messages for this field
     */
    if (this.field.messages !== false) {
      this.fieldMessagesService.updateVisibleMessages({
        control: this.control,
        field: this.field,
        defaultMessages: this.config.messages,
        values
      });
    }

    /**
     * Mark the component for check for the ChangeDetector
     */
    if (this.componentCdr) {
      this.componentCdr.markForCheck();
    }
  }
}
