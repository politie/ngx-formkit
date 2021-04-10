import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { IRepeatableField } from '../../models/field.model';
import { formGroupFromBlueprint } from '../../helpers';

@Component({
  selector: 'formkit-repeatable-field',
  templateUrl: './repeatable-field.component.html'
})
export class RepeatableFieldComponent {
  @Input() control!: FormArray;
  @Input() field!: IRepeatableField<any, any, any>;
  @Input() name!: string;
  @Input() form!: FormGroup;

  onAdd() {
    this.control.push(formGroupFromBlueprint(this.field));
  }

  onRemove(index: number) {
    this.control.removeAt(index);
  }
}
