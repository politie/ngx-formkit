import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IRadioField } from '../../models';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
  selector: 'formkit-radio-field',
  templateUrl: './radio-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class RadioFieldComponent extends FieldBaseComponent {
  @Input() control!: FormControl;
  @Input() field!: IRadioField<any, any>;
}
