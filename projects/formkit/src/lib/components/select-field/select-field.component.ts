import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IConfig, ISelectField, Options } from '../../models';
import { isObservable, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'formkit-select-field',
  templateUrl: './select-field.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFieldComponent implements OnInit, OnDestroy {
  @Input() control!: FormControl;
  @Input() form!: Required<IConfig<any>>;
  @Input() field!: ISelectField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;

  destroy$ = new Subject<boolean>();
  options$: Observable<Options[]> | undefined;

  ngOnInit() {
    if (!this.field) {
      return;
    }

    if (isObservable(this.field.options)) {
      this.options$ = this.field.options;
    } else {
      this.options$ = of(this.field.options);
    }

    this.options$.pipe(takeUntil(this.destroy$)).subscribe(options => {
      if (options && options.length === 1 && this.control.value === null && this.field.autoselectSingleOption === true) {
        if (!options[0].disabled) {
          this.control.setValue(options[0], { emitEvent: true });
        }
      }
    });
  }

  compareFunction(option: Options, value: Options) {
    return (option && value && option.id === value.id);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
