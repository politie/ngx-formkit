import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ISingleField } from '../../models';
import { Subject } from 'rxjs';
import { IFieldBaseComponent } from './field-base.component.model';

@Component({
  selector: 'formkit-field-base',
  template: '<p>FieldBaseComponent. You can extend this component.</p>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldBaseComponent implements IFieldBaseComponent, OnDestroy {
  @Input() control!: AbstractControl | FormControl | FormArray | FormGroup;
  @Input() field!: ISingleField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;

  destroy$ = new Subject<boolean>();

  ngOnDestroy() {
    console.log('destroy', this.name);
    this.destroy$.next(true);
  }
}
