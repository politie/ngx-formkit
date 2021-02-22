import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  IConfig,
  IArrayField,
  ISingleField
} from '../../models/field.model';

@Component({
  selector: 'formkit-array-field',
  templateUrl: './array-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayFieldComponent {
  @Input() control!: FormArray;
  @Input() form!: Required<IConfig<any>>;
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
