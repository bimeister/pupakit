import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PupakitCore } from './../../dist/@meistersoft/pupakit';
import { AppComponent } from './app.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, PupakitCore, FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
  providers: []
})
export class AppModule {}
