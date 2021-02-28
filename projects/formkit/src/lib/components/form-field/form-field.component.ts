import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver, EventEmitter,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldMessage, FieldMessageType, FieldType } from '../../models/field.model';
import { Observable, Subject } from 'rxjs';
import { extractEvents } from '../../helpers/extract-events.helpers';
import { FormEvent, FormEventType, FormValues } from '../../models/form.model';
import { delay, filter, map, take, takeUntil } from 'rxjs/operators';
import { FormFieldDirective } from '../../directives';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../config/config.token';
import { FormKitModuleConfig } from '../../models/config.model';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
  selector: 'formkit-form-field',
  templateUrl: './form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent extends FieldBaseComponent implements OnInit, OnDestroy {
  @Output() visibilityChange: EventEmitter<{ name: string; hide: boolean; }> = new EventEmitter<{name: string; hide: boolean}>()

  /**
   * Apply classes to the host component
   */
  @HostBinding('style.--column-span') get fieldWidth(): string {
    return this.field.width ? this.field.width.toString() : '12';
  };

  @HostBinding('class') get fieldClasses(): string {
    return [
      'formkit-field',
      (this.field.hide) ? 'hidden' : ''
    ].filter(Boolean).join(' ');
  }

  /**
   * Serves as host for rendering the field components
   */
  @ViewChild(FormFieldDirective, { static: true }) fieldHost!: FormFieldDirective;

  destroy$ = new Subject<boolean>();
  messages$!: Observable<FieldMessage[]>;

  FieldType = FieldType;
  FieldMessageType = FieldMessageType;

  private messagesSubject$ = new Subject<FieldMessage[]>();
  private firstUpdate = true;

  constructor(
    private resolver: ComponentFactoryResolver,
    @Inject(FORMKIT_MODULE_CONFIG_TOKEN) private config: FormKitModuleConfig
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.field || !this.control) {
      return;
    }

    this.renderFieldComponent();
    this.setupOneTimeFormControlEventListener();
    this.setupFormEventListener();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
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
    compRef.instance.formEvents$ = this.formEvents$;
    compRef.instance.formGroup = this.formGroup;
    compRef.instance.field = this.field;
    compRef.instance.name = this.name;
  }

  /**
   * Sets up a event listener for the form events$ observable.
   */
  setupFormEventListener() {
    this.formEvents$.pipe(
      filter(event => (event.type === FormEventType.OnAfterUpdateChecks)),
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
    this.messages$ = this.messagesSubject$.asObservable();

    extractEvents(this.control).pipe(
      take(1),
      delay(10),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.field.messages) {
        this.updateMessages(this.formGroup.getRawValue());
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
     * Dispatch the onInit hook in the first AfterUpdate cycle
     * so that the formGroup values are filled with the default or passed values
     * in the create() method.
     */
    if (this.firstUpdate && this.field.hooks?.onInit) {
      this.firstUpdate = false;

      this.field.hooks.onInit({
        control: this.control as FormControl | FormArray | FormGroup,
        errors: this.control.errors,
        values
      });
    }

    if (this.field.hidden) {
      this.updateHiddenState(typeof this.field.hidden === 'boolean' ? this.field.hidden : this.field.hidden(values));
    }

    if (this.field.disabled) {
      this.updateDisabledState(typeof this.field.disabled === 'boolean' ? this.field.disabled : this.field.disabled(values));
    }

    if (this.field.required) {
      this.updateRequiredState(typeof this.field.required === 'boolean' ? this.field.required : this.field.required(values));
    }

    if (this.field.messages) {
      this.updateMessages(values);
    }
  }

  updateHiddenState(match: boolean) {
    if (this.field && this.field.hide !== match) {
      this.visibilityChange.emit({ name: this.name, hide: match });
    }
  }

  updateDisabledState(match: boolean) {
    if (match && this.control.enabled) {
      this.control.disable({ onlySelf: true, emitEvent: false });
    } else if (!match && this.control.disabled) {
      this.control.enable({ onlySelf: true, emitEvent: false });
    }
  }

  updateRequiredState(match: boolean) {
    this.control.setErrors(match ? Validators.required(this.control) : null);
  }

  updateMessages(values: FormValues<any>) {
    if (!this.field.messages) {
      return;
    }

    const messages: FieldMessage[] = [];

    /**
     * Payload for the show function parameter
     */
    const payload = {
      control: this.control as FormControl | FormArray | FormGroup,
      errors: this.control.errors || {},
      values
    };

    for (const item of this.field.messages) {
      let show = false;

      if (typeof item.show === 'boolean') {
        show = item.show;
      } else if (typeof item.show === 'function') {
        show = item.show(payload);
      }

      /**
       * If the specific message should show, push it in the messages array
       */
      if (show) {
        messages.push({
          type: item.type || FieldMessageType.Information,
          text: (typeof item.text === 'string') ? item.text : item.text(payload)
        });
      }
    }

    /**
     * Emit a new value to the messagesSubject$ Subject
     */
    this.messagesSubject$.next(messages);
  }
}
