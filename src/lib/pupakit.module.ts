import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID, NgModule } from '@angular/core';

import { SharedModule } from './shared/shared.module';

registerLocaleData(localeRu);

@NgModule({
  imports: [SharedModule],
  declarations: [],
  providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }]
})
export class PupakitModule {}
