import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PupakitCore } from './../../dist/@meistersoft/pupakit';
import { AppComponent } from './app.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, PupakitCore],
  providers: []
})
export class AppModule {}
