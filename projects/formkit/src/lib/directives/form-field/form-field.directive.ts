import { Directive, ViewContainerRef } from '@angular/core';

/**
 * This directive is used in FormFieldComponent to render the
 * components used by fields in the template.
 */
@Directive({
  selector: '[libFbFormField]'
})
export class FormFieldDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
