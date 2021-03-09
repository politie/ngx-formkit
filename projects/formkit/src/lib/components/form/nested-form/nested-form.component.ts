import { Component, OnInit } from '@angular/core';
import { FormBaseComponent } from '../form-base/form-base.component';

@Component({
  selector: 'formkit-sub-form',
  templateUrl: './nested-form.component.html',
  styleUrls: ['./nested-form.component.css']
})
export class NestedFormComponent extends FormBaseComponent<any> implements OnInit {
  ngOnInit() {
    super.ngOnInit();
    this.created = true;
  }
}
