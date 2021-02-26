import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FormEvent, IToggleField } from '../../models';

@Component({
  selector: 'formkit-toggle-field',
  templateUrl: './toggle-field.component.html',
  styles: [':host { display: block; }']
})
export class ToggleFieldComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: IToggleField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }
}
