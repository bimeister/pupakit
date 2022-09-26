import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { IconModule } from '../icon/icon.module';
import { SearchFieldComponent } from './components/search-field/search-field.component';

@NgModule({
  declarations: [SearchFieldComponent],
  imports: [SharedModule, ButtonsModule, IconModule.forFeature()],
  exports: [SearchFieldComponent],
})
export class SearchFieldModule {}
