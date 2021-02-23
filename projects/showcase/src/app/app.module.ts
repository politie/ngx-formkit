import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { E2eComponent } from './components/e2e/e2e.component';
import { E2eFormCreatorComponent } from './components/e2e-form-creator/e2e-form-creator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormKitModule } from '../../../formkit/src/public-api';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    E2eComponent,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
