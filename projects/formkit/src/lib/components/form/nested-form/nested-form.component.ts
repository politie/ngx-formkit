import { Component, OnInit } from '@angular/core';
import { FormBaseComponent } from '../form-base/form-base.component';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'formkit-sub-form',
  templateUrl: './nested-form.component.html',
  styleUrls: ['./nested-form.component.css']
})
export class NestedFormComponent extends FormBaseComponent<any> implements OnInit {
  constructor(private formService: FormService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.created = true;
  }
}
