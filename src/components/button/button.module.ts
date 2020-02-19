import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../internal/shared/shared.module';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [ButtonComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ButtonComponent]
})
export class ButtonModule {}
