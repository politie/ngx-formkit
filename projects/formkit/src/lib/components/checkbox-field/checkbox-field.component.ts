import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { ICheckboxesField, ICheckboxField } from '../../models/field.model';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
  selector: 'formkit-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class CheckboxFieldComponent extends FieldBaseComponent {
  @Input() control!: FormControl | FormArray;
  @Input() field!: ICheckboxField<any, any, any> | ICheckboxesField<any, any, any>;

  @HostBinding('class') get fieldClasses(): string {
    return this.field?.hasOwnProperty('options') ? 'checkbox-field-multiple' : 'checkbox-field-single';
  }
}
