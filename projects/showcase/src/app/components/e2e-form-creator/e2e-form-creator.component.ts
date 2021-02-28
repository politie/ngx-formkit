import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormComponent, FormFields, IFormGroup } from 'formkit';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-e2e-form-creator',
  templateUrl: './e2e-form-creator.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class E2eFormCreatorComponent implements OnInit {
  @Input() debug!: boolean;
  @Input() fields!: FormFields<any>;
  @Input() title!: string;
  @Input() message!: string;
  @ViewChild('FormKitForm', { static: true }) formComponent!: FormComponent<any>;
  form = new FormGroup({}) as IFormGroup<any>;

  constructor() { }

  ngOnInit() { }

  onSubmit() {
    console.log(`Form "${this.title}" has been submitted.`);
  }
}
