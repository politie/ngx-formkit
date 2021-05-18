import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ITextareaField } from '../../models';
import { FieldBaseDirective } from '../../directives/field-base/field-base.directive';

@Component({
  selector: 'formkit-textarea-field',
  templateUrl: './textarea-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class TextareaFieldComponent extends FieldBaseDirective {
  @Input() control!: FormControl;
  @Input() field!: ITextareaField<any, any, any>;
}
