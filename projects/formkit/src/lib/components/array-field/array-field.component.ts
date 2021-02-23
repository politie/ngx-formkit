import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IArrayField, ISingleField } from '../../models/field.model';
import { Subject } from 'rxjs';
import { FormEvent } from '../../models';

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
    const obj: {[key: string]: FormControl} = {};

    for (const key of Object.keys(this.field.blueprint))  {
      const childField: ISingleField<any, any> = this.field.blueprint[key];
      obj[key] = childField.control();
    }

    this.control.push(new FormGroup(obj as {[key: string]: FormControl}));
  }

  onRemove(index: number) {
    this.control.removeAt(index);
  }
}
