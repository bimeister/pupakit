import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../internal/shared/shared.module';
import { SwitcherComponent } from './components/switcher/switcher.component';

@NgModule({
  declarations: [SwitcherComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [SwitcherComponent]
})
export class SwitcherModule {}
