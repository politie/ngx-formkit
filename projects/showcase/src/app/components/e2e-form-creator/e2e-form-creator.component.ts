import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormComponent, IFormGroup } from 'formkit';
import { FormGroup } from '@angular/forms';
import { FormKitFormConfig } from '../../../../../formkit/src/lib';

@Component({
  selector: 'app-e2e-form-creator',
  templateUrl: './e2e-form-creator.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class E2eFormCreatorComponent {
  @Input() debug!: boolean;
  @Input() config!: FormKitFormConfig<any>;
  @Input() title!: string;
  @Input() message!: string;
  @ViewChild('FormKitForm', { static: true }) formComponent!: FormComponent<any>;
  form = new FormGroup({}) as IFormGroup<any>;

  constructor() { }

  onSubmit() {
    if (this.formComponent.onSubmitClick()) {
      console.log(`Form "${this.title}" has been submitted.`);
    }
  }
}
