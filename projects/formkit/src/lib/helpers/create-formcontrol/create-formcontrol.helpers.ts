import { AbstractControlOptions, FormControl } from '@angular/forms';

export const createFormControl = (value: any = null, options: AbstractControlOptions = {}): FormControl => new FormControl(value, options);
