import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { SelectorComponent } from './components/selector/selector.component';
import { SelectorItemComponent } from './components/selector-item/selector-item.component';

@NgModule({
  declarations: [SelectorComponent, SelectorItemComponent],
  imports: [SharedModule],
  exports: [SelectorComponent, SelectorItemComponent]
})
export class SelectorModule {}
