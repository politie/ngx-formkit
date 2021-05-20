import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { ICheckboxesField, ICheckboxField } from '../../models/field.model';
import { FieldBaseDirective } from '../../directives/field-base/field-base.directive';
import { Options } from '../../models/form.model';

@Component({
  selector: 'formkit-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class CheckboxFieldComponent extends FieldBaseDirective {
  @Input() control!: FormControl | FormArray;
  @Input() field!: ICheckboxField<any, any, any> | ICheckboxesField<any, any, any>;

  @HostBinding('class') get fieldClasses(): string {
    return this.field?.hasOwnProperty('options') ? 'checkbox-field-multiple' : 'checkbox-field-single';
  }

  onCheckboxChange(event: Event & { target: HTMLInputElement }, option: Options) {
    if (event.target.checked && this.control.value.indexOf(option.id) < 0) {
      this.control.setValue([...this.control.value, ...[option.id]], { emitEvent: true, onlySelf: false });
    } else {
      const currentValue = this.control.value.slice();
      currentValue.splice(this.control.value.indexOf(option.id), 1);
      this.control.setValue(currentValue, { emitEvent: true, onlySelf: false });
    }
  }
}
