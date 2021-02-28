import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FieldType, ITextField } from '../../models';
import { FieldBaseComponent } from '../field-base/field-base.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'formkit-text-field',
  templateUrl: './text-field.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextFieldComponent extends FieldBaseComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() field!: ITextField<any, any>;
  type = 'text';

  ngOnInit() {
    switch(this.field.type) {
      case FieldType.Date:
        this.type = 'date';
        break;
      case FieldType.Email:
        this.type = 'email';
        break;
      case FieldType.Number:
        this.type = 'number';
        break;
      default:
        this.type = 'text';
    }
  }
}
