import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { E2eFormCreatorComponent } from './components/e2e-form-creator/e2e-form-creator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormKitModule } from '../../../formkit/src/public-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    E2eFormCreatorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FormKitModule.forRoot({
      text: {
        loading: 'test loading'
      }
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
