import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { ButtonModule } from '../buttons/button.module';

@NgModule({
  declarations: [SearchFieldComponent],
  imports: [SharedModule, ButtonModule, IconModule.forFeature()],
  exports: [SearchFieldComponent],
})
export class SearchFieldModule {}
