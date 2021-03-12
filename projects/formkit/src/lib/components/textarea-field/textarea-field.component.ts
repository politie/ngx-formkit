import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ITextareaField } from '../../models';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
  selector: 'formkit-textarea-field',
  templateUrl: './textarea-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class TextareaFieldComponent extends FieldBaseComponent {
  @Input() control!: FormControl;
  @Input() field!: ITextareaField<any, any, any>;
}
