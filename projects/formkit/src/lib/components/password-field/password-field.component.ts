import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormEvent, IPasswordField } from '../../models';
import { Subject } from 'rxjs';

@Component({
  selector: 'formkit-password-field',
  templateUrl: './password-field.component.html',
  styles: [':host { display: block; }']
})
export class PasswordFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: IPasswordField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
  @Input() showPasswords = false;
  @Output() togglePasswordVisibility = new EventEmitter<void>();

  onTogglePasswordVisibility() {
    this.togglePasswordVisibility.emit();
    this.showPasswords = !this.showPasswords;
  }
}
