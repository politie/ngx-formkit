import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IConfig, ITextareaField } from '../../models';

@Component({
  selector: 'formkit-textarea-field',
  templateUrl: './textarea-field.component.html',
  styles: [':host { display: block; }']
})
export class TextareaFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() form!: Required<IConfig<any>>;
  @Input() field!: ITextareaField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
