import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [SearchFieldComponent],
  imports: [SharedModule, IconModule.forFeature()],
  exports: [SearchFieldComponent]
})
export class SearchFieldModule {}
