import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { IArrayField } from '../../models/field.model';
import { Subject } from 'rxjs';
import { FormEvent } from '../../models';
import { createFormGroupFromBlueprint } from '../../helpers';

@Component({
  selector: 'formkit-array-field',
  templateUrl: './array-field.component.html'
})
export class ArrayFieldComponent {
  @Input() control!: FormArray;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: IArrayField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;

  onAdd() {
    this.control.push(createFormGroupFromBlueprint(this.field));
  }

  onRemove(index: number) {
    this.control.removeAt(index);
  }
}
