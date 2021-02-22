import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IConfig, IHiddenField } from '../../models';

@Component({
  selector: 'formkit-hidden-field',
  templateUrl: './hidden-field.component.html'
})
export class HiddenFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() form!: Required<IConfig<any>>;
  @Input() field!: IHiddenField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
