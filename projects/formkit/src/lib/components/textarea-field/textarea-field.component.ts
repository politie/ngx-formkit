import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormEvent, ITextareaField } from '../../models';
import { Subject } from 'rxjs';

@Component({
  selector: 'formkit-textarea-field',
  templateUrl: './textarea-field.component.html',
  styles: [':host { display: block; }']
})
export class TextareaFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: ITextareaField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
