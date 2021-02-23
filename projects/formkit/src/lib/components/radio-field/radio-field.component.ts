import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormEvent, IRadioField } from '../../models';
import { Subject } from 'rxjs';

@Component({
  selector: 'formkit-radio-field',
  templateUrl: './radio-field.component.html',
  styles: [':host { display: block; }']
})
export class RadioFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: IRadioField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
