import { NgModule } from '@angular/core';
import { appCrossCircleIcon } from '../../../internal/constants/icons/app-cross-circle-icon.const';
import { appSearchIcon } from '../../../internal/constants/icons/app-search-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { IconModule } from '../icon/icon.module';
import { SearchFieldComponent } from './components/search-field/search-field.component';

@NgModule({
  declarations: [SearchFieldComponent],
  imports: [SharedModule, ButtonsModule, IconModule.forFeature([appCrossCircleIcon, appSearchIcon])],
  exports: [SearchFieldComponent],
})
export class SearchFieldModule {}
