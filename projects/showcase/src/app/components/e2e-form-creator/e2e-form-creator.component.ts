import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormComponent, FormKitFormConfig, IFormGroup } from '@politie/ngx-formkit';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environment';

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

  get linkToInputs() {
    return `${environment.repoLink}${environment.projectsPath}${environment.srcPath}examples/`;
  }

  onReset() {
    this.formComponent.reset();
  }

  onSubmit() {
    if (this.formComponent.onSubmitClick()) {
      console.log(`Form "${this.title}" has been submitted.`);
    }
  }
}
