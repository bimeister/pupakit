import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PupakitCore } from './../../dist/@meistersoft/pupakit';
import { AppComponent } from './app.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [PupakitCore, FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
  providers: []
})
export class AppModule {}
