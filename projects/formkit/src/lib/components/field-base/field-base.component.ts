import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FormEvent, ISingleField } from '../../models';

@Component({
  selector: 'formkit-field-base',
  template: '<p>FieldBaseComponent. You can extend this component.</p>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldBaseComponent {
  @Input() control!: AbstractControl | FormControl | FormArray | FormGroup;
  @Input() field!: ISingleField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
