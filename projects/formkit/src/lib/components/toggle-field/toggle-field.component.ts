import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IToggleField } from '../../models';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
  selector: 'formkit-toggle-field',
  templateUrl: './toggle-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class ToggleFieldComponent extends FieldBaseComponent {
  @Input() control!: FormControl;
  @Input() field!: IToggleField<any, any, any>;
}
