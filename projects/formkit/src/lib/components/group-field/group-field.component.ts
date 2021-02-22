import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IConfig, IGroupField } from '../../models';

@Component({
  selector: 'formkit-group-field',
  templateUrl: './group-field.component.html',
  styles: [':host { display: block; }']
})
export class GroupFieldComponent {
  @Input() control!: FormGroup;
  @Input() form!: Required<IConfig<any>>;
  @Input() field!: IGroupField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
