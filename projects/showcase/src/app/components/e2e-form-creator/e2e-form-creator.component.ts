import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormComponent, FormFields, IFormGroup } from 'formkit';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-e2e-form-creator',
  templateUrl: './e2e-form-creator.component.html',
  styleUrls: ['./e2e-form-creator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class E2eFormCreatorComponent {
  @ViewChild('FormKitForm', { static: true }) formComponent!: FormComponent<any>;
  form = new FormGroup({}) as IFormGroup<any>;

  @Input() debug!: boolean;
  @Input() fields!: FormFields<any>;
  @Input() title!: string;
  @Input() message!: string;

  constructor() { }

  onSubmit() {
    console.log(`Form "${this.title}" has been submitted.`);
  }
}
