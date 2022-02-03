import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { SwitcherComponent } from './components/switcher/switcher.component';

@NgModule({
  declarations: [SwitcherComponent],
  imports: [SharedModule],
  exports: [SwitcherComponent],
})
export class SwitcherModule {}
