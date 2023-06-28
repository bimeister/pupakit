import { NgModule, Type } from '@angular/core';
import { FlexPanelComponent } from './components/flex-panel/flex-panel.component';
import { CommonModule } from '@angular/common';

const EXTERNAL_COMPONENTS: Type<unknown>[] = [FlexPanelComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [EXTERNAL_COMPONENTS],
  exports: [EXTERNAL_COMPONENTS],
})
export class PupaFlexPanelModule {}
