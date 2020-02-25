import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../internal/shared/shared.module';
import { IconButtonModule } from './../icon-button/icon-button.module';
import { WasherComponent } from './components/washer/washer.component';

@NgModule({
  declarations: [WasherComponent],
  imports: [SharedModule, IconButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [WasherComponent]
})
export class WasherModule {}
