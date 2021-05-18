import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IRadioField } from '../../models';
import { FieldBaseDirective } from '../../directives/field-base/field-base.directive';

@Component({
  selector: 'formkit-radio-field',
  templateUrl: './radio-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class RadioFieldComponent extends FieldBaseDirective {
  @Input() control!: FormControl;
  @Input() field!: IRadioField<any, any, any>;
}
