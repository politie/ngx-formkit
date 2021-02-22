import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormComponent, FormKitForm } from 'formkit';

@Component({
  selector: 'app-e2e-form-creator',
  templateUrl: './e2e-form-creator.component.html',
  styleUrls: ['./e2e-form-creator.component.css']
})
export class E2eFormCreatorComponent implements OnInit {
  @ViewChild('form', { static: true }) formComponent!: FormComponent<any>;

  @Input() config!: FormKitForm<any>;
  @Input() title!: string;

  constructor() { }

  ngOnInit(): void {}

  onSubmit() {
    console.log(`Form "${this.title}" has been submitted.`);
  }
}
