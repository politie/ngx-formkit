import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IConfig, IRadioField } from '../../models';

@Component({
  selector: 'formkit-radio-field',
  templateUrl: './radio-field.component.html',
  styles: [':host { display: block; }']
})
export class RadioFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() form!: Required<IConfig<any>>;
  @Input() field!: IRadioField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
