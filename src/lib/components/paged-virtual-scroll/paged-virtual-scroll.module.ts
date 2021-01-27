import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { PagedVirtualScrollItemComponent } from './components/paged-virtual-scroll-item/paged-virtual-scroll-item.component';
import { PagedVirtualScrollViewportComponent } from './components/paged-virtual-scroll-viewport/paged-virtual-scroll-viewport.component';
import { PagedVirtualScrollForDirective } from './directives/paged-virtual-scroll-for.directive';
import { PagedVirtualScrollScrollComponent } from './components/paged-virtual-scroll-scroll/paged-virtual-scroll-scroll.component';

const COMPONENTS: any[] = [
  PagedVirtualScrollViewportComponent,
  PagedVirtualScrollItemComponent,
  PagedVirtualScrollScrollComponent
];

const DIRECTIVES: any[] = [PagedVirtualScrollForDirective];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [SharedModule],
  exports: [...COMPONENTS, ...DIRECTIVES]
})
export class PagedVirtualScrollModule {}
