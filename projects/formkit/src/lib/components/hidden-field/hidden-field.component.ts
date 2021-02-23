import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormEvent, IHiddenField } from '../../models';
import { Subject } from 'rxjs';

@Component({
  selector: 'formkit-hidden-field',
  templateUrl: './hidden-field.component.html'
})
export class HiddenFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: IHiddenField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
