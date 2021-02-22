import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormkitModule } from '../../../formkit/src/lib/formkit.module';
import { E2eComponent } from './components/e2e/e2e.component';
import { E2eFormCreatorComponent } from './components/e2e-form-creator/e2e-form-creator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    E2eComponent,
    E2eFormCreatorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormkitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
