import { NgModule, Type } from '@angular/core';
import { PupaActionsModule } from './components/actions/actions.module';
import { PupaFloatingCardModule } from './components/floating-card/floating-card.module';
import { PupaInfinityScrollerModule } from './components/infinity-scroller/infinity-scroller.module';
import { PupaPagedVirtualScrollModule } from './components/paged-virtual-scroll/paged-virtual-scroll.module';

const MODULES: Type<unknown>[] = [
  PupaInfinityScrollerModule,
  PupaFloatingCardModule,
  PupaActionsModule,
  PupaPagedVirtualScrollModule,
];

@NgModule({
  declarations: [],
  imports: MODULES,
  exports: MODULES,
})
export class PupaWidgetsModule {}
