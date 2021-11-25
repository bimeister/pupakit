import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { IconModule } from '../icon/icon.module';
import { ButtonModule } from '../button/button.module';

@NgModule({
  declarations: [SearchFieldComponent],
  imports: [SharedModule, ButtonModule, IconModule.forFeature()],
  exports: [SearchFieldComponent]
})
export class SearchFieldModule {}
