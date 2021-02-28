import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICheckboxField } from '../../models/field.model';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
  selector: 'formkit-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class CheckboxFieldComponent extends FieldBaseComponent {
  @Input() control!: FormControl;
  @Input() field!: ICheckboxField<any, any>;
}
