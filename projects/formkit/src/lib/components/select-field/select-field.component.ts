import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ISelectField, Options } from '../../models';
import { isObservable, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldBaseDirective } from '../../directives/field-base/field-base.directive';

@Component({
  selector: 'formkit-select-field',
  templateUrl: './select-field.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFieldComponent extends FieldBaseDirective implements OnInit, OnDestroy {
  @Input() control!: FormControl;
  @Input() field!: ISelectField<any, any, any>;

  destroy$ = new Subject<boolean>();
  options$!: Observable<Options[]>;

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
          this.control.setValue(options[0], { emitEvent: false });
        }
      }
    });
  }

  compareFunction(option: Options, value: Options) {
    return ((option === null && value === null) || (option && value && option.id === value.id));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
