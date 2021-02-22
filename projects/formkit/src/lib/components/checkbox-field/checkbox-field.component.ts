import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IConfig, ICheckboxField } from '../../models/field.model';

@Component({
  selector: 'formkit-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styles: [':host { display: block; }']
})
export class CheckboxFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() form!: Required<IConfig<any>>;
  @Input() field!: ICheckboxField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
