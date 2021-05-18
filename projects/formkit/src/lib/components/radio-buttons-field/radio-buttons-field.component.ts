import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IRadioField } from '../../models';
import { FieldBaseDirective } from '../../directives/field-base/field-base.directive';

@Component({
  selector: 'formkit-radio-buttons-field',
  templateUrl: './radio-buttons-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class RadioButtonsFieldComponent extends FieldBaseDirective {
  @Input() control!: FormControl;
  @Input() field!: IRadioField<any, any, any>;
}
