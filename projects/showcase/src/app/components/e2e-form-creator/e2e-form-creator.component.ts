import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormComponent, FormFields } from 'formkit';
import { BasicForm } from '../e2e/inputs/e2e.basic.inputs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-e2e-form-creator',
  templateUrl: './e2e-form-creator.component.html',
  styleUrls: ['./e2e-form-creator.component.css']
})
export class E2eFormCreatorComponent implements OnInit {
  @ViewChild('FormKitForm', { static: true }) formComponent!: FormComponent<BasicForm>;
  form = new FormGroup({});

  @Input() fields!: FormFields<BasicForm>;
  @Input() title!: string;

  constructor() { }

  ngOnInit(): void { }

  onSubmit() {
    console.log(`Form "${this.title}" has been submitted.`);
  }
}
