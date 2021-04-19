import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ISingleField } from '../../models';
import { Subject } from 'rxjs';
import { IFieldBaseComponent } from './field-base.component.model';

@Component({
  selector: 'formkit-field-base',
  template: '<p>FieldBaseComponent. You can extend this component.</p>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldBaseComponent implements IFieldBaseComponent, AfterViewInit, OnDestroy {
  @Input() control!: AbstractControl | FormControl | FormArray | FormGroup;
  @Input() field!: ISingleField<any, any, any>;
  @Input() name!: string;
  @Input() form!: FormGroup;
  @ViewChild('input') input!: ElementRef;

  destroy$ = new Subject<boolean>();

  ngAfterViewInit() {
    if (this.field && this.field.hasOwnProperty('autofocus') && this.input && this.input.nativeElement) {
      this.input.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
