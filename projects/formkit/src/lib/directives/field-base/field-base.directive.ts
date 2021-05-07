import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ISingleField } from '../../models';
import { Subject } from 'rxjs';
import { IFieldBaseDirective } from './field-base.directive.model';

@Directive({
  selector: '[formkitFieldBase]'
})
export class FieldBaseDirective implements IFieldBaseDirective, AfterViewInit, OnDestroy {
  @Input() control!: AbstractControl | FormControl | FormArray | FormGroup;
  @Input() field!: ISingleField<any, any, any>;
  @Input() name!: string;
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
