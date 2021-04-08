import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { IArrayField } from '../../models/field.model';
import { formGroupFromBlueprint } from '../../helpers';

@Component({
  selector: 'formkit-array-field',
  templateUrl: './array-field.component.html'
})
export class ArrayFieldComponent {
  @Input() control!: FormArray;
  @Input() field!: IArrayField<any, any, any>;
  @Input() name!: string;
  @Input() form!: FormGroup;

  onAdd() {
    this.control.push(formGroupFromBlueprint(this.field));
  }

  onRemove(index: number) {
    this.control.removeAt(index);
  }
}
