import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormEvent, ITextField } from '../../models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'formkit-text-field',
  templateUrl: './text-field.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextFieldComponent {
  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() formEvents$!: Subject<FormEvent>;
  @Input() field!: ITextField<any, any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
}
