import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IPasswordField } from '../../models';
import { FieldBaseDirective } from '../../directives/field-base/field-base.directive';

@Component({
  selector: 'formkit-password-field',
  templateUrl: './password-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block; }']
})
export class PasswordFieldComponent extends FieldBaseDirective {
  @Input() control!: FormControl;
  @Input() field!: IPasswordField<any, any, any>;
  @Input() showPasswords = false;
  @Output() togglePasswordVisibility = new EventEmitter<void>();

  onTogglePasswordVisibility() {
    this.togglePasswordVisibility.emit();
    this.showPasswords = !this.showPasswords;
  }
}
