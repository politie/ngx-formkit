import { Component, Input } from '@angular/core';
import { IConfig, ITextField } from '../../models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'formkit-text-field',
  templateUrl: './text-field.component.html',
  styles: [':host { display: block; }']
})
export class TextFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() form!: Required<IConfig<any>>;
  @Input() field!: ITextField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
