import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { PupakitCore } from './../../dist/@meistersoft/pupakit';
import { AppComponent } from './app.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, PupakitCore, FormsModule, ReactiveFormsModule],
  providers: []
})
export class AppModule {}
