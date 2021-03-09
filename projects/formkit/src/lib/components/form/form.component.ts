import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject, timer } from 'rxjs';

import { FormEventType, FormKitModuleConfig, FormUpdateType, TransformValues } from '../../models';

import { debounce, delay, filter, map, takeUntil, tap } from 'rxjs/operators';
import { FORMKIT_MODULE_CONFIG_TOKEN } from '../../config/config.token';
import { FormService } from '../../services/form.service';
import { FormBaseComponent } from './form-base/form-base.component';
import { IFormComponent } from './form.component.model';

/**
 * Since NgPackagr will complain about Required (which exists in Typescript), we add
 * the @dynamic decorator right here to let the build --prod pass.
 */
// @dynamic
@Component({
  selector: 'formkit-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FormService
  ]
})
export class FormComponent<T> extends FormBaseComponent<T> implements IFormComponent<T>, OnInit, OnDestroy {
  formUpdateType: FormUpdateType = FormUpdateType.Init;

  readonly afterValueUpdateScheduler$ = new Subject<void>();
  private initialValues!: T;

  constructor(
    private cd: ChangeDetectorRef,
    private formService: FormService,
    @Inject(FORMKIT_MODULE_CONFIG_TOKEN) private config: Required<FormKitModuleConfig>
  ) {
    super();
  }

  get initialFormValues() {
    return this.initialValues;
  }

  get scheduler$() {
    return this.afterValueUpdateScheduler$;
  }

  get value$() {
    return this.formService.formEvents$.pipe(
      filter(event => event.type === FormEventType.OnAfterUpdateChecks),
      delay(25),
      map(() => this.form.getRawValue()),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    /**
     * Store the initialValues of the form. If the form is reset, these
     * will be the fallback values.
     */
    this.initialValues = this.form.getRawValue();

    /**
     * Set up the AfterValueUpdateScheduler.
     * This scheduler is responsible for emitting events to child FormField components
     */
    this.setupAfterValueUpdateScheduler();

    /**
     * Trigger a event emit for the first time checks
     */
    this.afterValueUpdateScheduler$.next();

    /**
     * Watch form changes and apply the AfterValueChangesChecks on changes.
     * Only update if the update isn't triggered by a control with a resetFormOnChange
     * property (these fields have their own valueChanges listener and will trigger
     * the updateScheduler accordingly.
     */
    merge(
      this.formService.fieldEvents$.pipe(
        filter(() => this.formUpdateType === FormUpdateType.User),
        map(event => event.values),
        tap(values => {
          this.formUpdateType = FormUpdateType.Reset;
          this.form.reset({ ...this.initialValues, ...values }, { emitEvent: false, onlySelf: true });
        })
      ),
      this.form.valueChanges.pipe(
        filter(() => this.formUpdateType !== FormUpdateType.Reset)
      )
    ).pipe(takeUntil(this.destroy$)).subscribe(() => this.afterValueUpdateScheduler$.next());

    /**
     * Everything done, update the created prop and emit event
     */
    this.created = true;

    /**
     * Run change detection
     */
    this.cd.markForCheck();
  }

  /**
   * Use the patch property to reliably patch the form with new values.
   * This is useful if you have a field with `resetFormOnChange` properties
   * set in your fields definition.
   *
   * @param patch the values to use for patching
   */
  patch(patch: Partial<T>) {
    this.formUpdateType = FormUpdateType.Patch;
    this.form.patchValue(patch, { onlySelf: false, emitEvent: false });
    this.afterValueUpdateScheduler$.next();
  }

  /**
   * Transforms the current set of form values and returns the transformed values.
   *
   * @param payload object with properties:
   * 'omit' for keys to emit from the result
   * 'transform': array with transforms per key
   */
  transformValues<K = T>(payload: TransformValues<T, K>) {
    const values: T = this.form.getRawValue();

    /* Apply transformations and delete original keys */
    if (typeof payload.transform === 'function') {
      const transforms = payload.transform(values);

      for (const transform of transforms) {

        /**
         * Transform the value of 'from' to 'to' without transform
         */
        if (typeof transform.to === 'string') {
          Object.defineProperty(values, transform.to, {
            enumerable: true,
            value: values[transform.from]
          });

          if (transform.to !== transform.from as string) {
            delete values[transform.from];
          }

        } else if (typeof transform.to === 'object') {
          const result = transform.to;
          const key: Extract<keyof K, string> = Object.keys(result)[0] as Extract<keyof K, string>;

          Object.defineProperty(values, key, {
            enumerable: true,
            value: result[key]
          });

          if (key as string !== transform.from) {
            delete values[transform.from];
          }
        }
      }
    }

    /**
     *  Do the omit as last, so we can transform keys first
     */
    if (payload.omit) {
      for (const key of payload.omit) {
        delete values[key];
      }
    }

    return values;
  }

  /**
   * Adds a subscription to the global afterValueUpdateScheduler$ observable with some delay.
   */
  setupAfterValueUpdateScheduler() {
    if (this.created) {
      return;
    }

    this.afterValueUpdateScheduler$.pipe(
      debounce(() => timer((this.formUpdateType === FormUpdateType.User) ? Math.min(Math.max(10, 2500), this.config.updateDebounceTime) : 0)),
      map(() => this.form.getRawValue()),
      takeUntil(this.destroy$)
    ).subscribe(values => {
        console.log(`Scheduling update caused by: ${FormUpdateType[this.formUpdateType]}`);

        this.formUpdateType = FormUpdateType.User;
        /**
         * For the first update cycle, we emit a FirstUpdateComplete Event, so
         * that Fields can run a OnInit Hook.
         */
        this.formService.triggerUpdateChecks(values);
    });
  }
}
