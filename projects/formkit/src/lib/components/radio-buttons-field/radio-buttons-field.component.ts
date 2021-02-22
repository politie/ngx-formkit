import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IConfig, IRadioField } from '../../models';

@Component({
  selector: 'formkit-radio-buttons-field',
  templateUrl: './radio-buttons-field.component.html',
  styles: [':host { display: block; }']
})
export class RadioButtonsFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() form!: Required<IConfig<any>>;
  @Input() field!: IRadioField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
