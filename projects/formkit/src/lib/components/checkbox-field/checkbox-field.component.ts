import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ICheckboxField } from '../../models/field.model';
import { Subject } from 'rxjs';
import { FormEvent } from '../../models';

@Component({
  selector: 'formkit-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styles: [':host { display: block; }']
})
export class CheckboxFieldComponent {
  @Input() control!: FormControl;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: ICheckboxField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
