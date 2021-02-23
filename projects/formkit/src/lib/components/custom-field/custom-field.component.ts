import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormEvent, ISingleFieldConfig } from '../../models';

@Component({
  selector: 'formkit-custom-field',
  template: ''
})
export class CustomFieldComponent implements OnInit, OnDestroy {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: ISingleFieldConfig<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;

  destroy$ = new Subject<boolean>();

  constructor() { }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
