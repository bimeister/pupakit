import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { IconButtonComponent } from './components/icon-button/icon-button.component';

@NgModule({
  declarations: [IconButtonComponent],
  imports: [SharedModule],
  exports: [IconButtonComponent],
})
export class IconButtonModule {}
