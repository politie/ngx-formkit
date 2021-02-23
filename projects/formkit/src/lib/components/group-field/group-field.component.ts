import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormEvent, IGroupField } from '../../models';
import { Subject } from 'rxjs';

@Component({
  selector: 'formkit-group-field',
  templateUrl: './group-field.component.html',
  styles: [':host { display: block; }']
})
export class GroupFieldComponent {
  @Input() control!: FormGroup;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: IGroupField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
