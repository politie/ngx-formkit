import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { E2eFormCreatorComponent } from './components/e2e-form-creator/e2e-form-creator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormKitModule } from '../../../formkit/src/public-api';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    E2eFormCreatorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormKitModule.forRoot({
      text: {
        loading: 'aapje'
      }
    })
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
