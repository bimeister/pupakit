import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { InfinityScrollerComponent } from './components/infinity-scroller/infinity-scroller.component';
import { SharedModule } from '../../../internal/shared/shared.module';
import { InfiniteScrollerItemTemplateDirective } from './directives/infinite-scroller-item-template.directive';
import { InfiniteScrollerBottomItemTemplateDirective } from './directives/infinity-scroller-bottom-item-template.directive';
import { InfiniteScrollerTopItemTemplateDirective } from './directives/infinity-scroller-top-item-template.directive';
import { ScrollableModule } from '../../components/scrollable/scrollable.module';

const EXTERNAL_COMPONENTS: Type<unknown>[] = [InfinityScrollerComponent];
const EXTERNAL_DIRECTIVES: Type<unknown>[] = [
  InfiniteScrollerItemTemplateDirective,
  InfiniteScrollerTopItemTemplateDirective,
  InfiniteScrollerBottomItemTemplateDirective,
];

const IMPORTS: (Type<unknown> | ModuleWithProviders<unknown>)[] = [SharedModule, ScrollableModule];

@NgModule({
  declarations: [...EXTERNAL_COMPONENTS, ...EXTERNAL_DIRECTIVES],
  imports: IMPORTS,
  exports: [...EXTERNAL_COMPONENTS, ...EXTERNAL_DIRECTIVES],
})
export class InfinityScrollerModule {}
