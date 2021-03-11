import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormEvent, FormEventType } from '../models';
import { filter } from 'rxjs/operators';

@Injectable()
export class FormService {
  public formEvents$: Observable<FormEvent>;
  public fieldEvents$: Observable<FormEvent>;

  private subject$ = new Subject<FormEvent>();

  constructor() {
    this.formEvents$ = this.subject$.pipe(filter(e => e.type === FormEventType.OnAfterUpdateChecks));
    this.fieldEvents$ = this.subject$.pipe(filter(e => e.type === FormEventType.OnResetByControl));
  }

  emitFormEvent(event: FormEvent) {
    this.subject$.next(event);
  }

  triggerFormResetByControl(values: Partial<any>) {
    this.subject$.next({ type: FormEventType.OnResetByControl, values});
  }

  triggerFormUpdateChecks(values: any) {
    this.subject$.next({ type: FormEventType.OnAfterUpdateChecks, values });
  }
}
