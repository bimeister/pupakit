import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { SelectorComponent } from './components/selector/selector.component';
import { SelectorItemComponent } from './components/selector-item/selector-item.component';

@NgModule({
  declarations: [SelectorComponent, SelectorItemComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [SelectorComponent, SelectorItemComponent]
})
export class SelectorModule {}
