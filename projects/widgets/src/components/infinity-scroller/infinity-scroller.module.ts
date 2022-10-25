import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { InfinityScrollerComponent } from './components/infinity-scroller/infinity-scroller.component';
import { InfiniteScrollerItemTemplateDirective } from './directives/infinite-scroller-item-template.directive';
import { InfiniteScrollerBottomItemTemplateDirective } from './directives/infinity-scroller-bottom-item-template.directive';
import { InfiniteScrollerTopItemTemplateDirective } from './directives/infinity-scroller-top-item-template.directive';
import { PupaScrollableModule } from '@bimeister/pupakit.kit';
import { CommonModule } from '@angular/common';

const EXTERNAL_COMPONENTS: Type<unknown>[] = [InfinityScrollerComponent];
const EXTERNAL_DIRECTIVES: Type<unknown>[] = [
  InfiniteScrollerItemTemplateDirective,
  InfiniteScrollerTopItemTemplateDirective,
  InfiniteScrollerBottomItemTemplateDirective,
];

const IMPORTS: (Type<unknown> | ModuleWithProviders<unknown>)[] = [CommonModule, PupaScrollableModule];

@NgModule({
  declarations: [...EXTERNAL_COMPONENTS, ...EXTERNAL_DIRECTIVES],
  imports: IMPORTS,
  exports: [...EXTERNAL_COMPONENTS, ...EXTERNAL_DIRECTIVES],
})
export class PupaInfinityScrollerModule {}
