import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IRadioField } from '../../models';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
  selector: 'formkit-radio-buttons-field',
  templateUrl: './radio-buttons-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class RadioButtonsFieldComponent extends FieldBaseComponent {
  @Input() control!: FormControl;
  @Input() field!: IRadioField<any, any>;
}
