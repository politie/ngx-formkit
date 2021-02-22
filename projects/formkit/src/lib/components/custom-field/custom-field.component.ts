import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IConfig, ISingleField } from '../../models';

@Component({
  selector: 'formkit-custom-field',
  template: ''
})
export class CustomFieldComponent implements OnInit, OnDestroy {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() form!: Required<IConfig<any>>;
  @Input() field!: ISingleField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;

  destroy$ = new Subject<boolean>();

  constructor() { }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
