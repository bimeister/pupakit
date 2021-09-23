import { registerLocaleData } from '@angular/common';
import localeRuExtra from '@angular/common/locales/extra/ru';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogPipe } from './log.pipe';
import { DemoSharedModule } from './shared/shared.module';

registerLocaleData(localeRu, 'ru-RU', localeRuExtra);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, LogPipe],
  imports: [
    BrowserModule,
    HammerModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DemoSharedModule,
    AppRoutingModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }],
  exports: [LogPipe]
})
export class AppModule {}
