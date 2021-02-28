import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FormEvent, ISingleFieldConfig } from '../../models';

@Component({
  selector: 'formkit-field-base',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldBaseComponent {
  @Input() control!: AbstractControl | FormControl | FormArray | FormGroup;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: ISingleFieldConfig<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
