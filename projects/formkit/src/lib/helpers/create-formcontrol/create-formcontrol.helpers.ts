import { FormControl, ValidatorFn } from '@angular/forms';

export const createFormControl = (value: any = null, validators: ValidatorFn[] | null | undefined = null): FormControl => new FormControl(value, validators);
