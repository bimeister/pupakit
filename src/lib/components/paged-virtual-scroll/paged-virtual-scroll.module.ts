import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { PagedVirtualScrollViewportComponent } from './components/paged-virtual-scroll-viewport/paged-virtual-scroll-viewport.component';
import { PupaVirtualScrollForDirective } from './directives/paged-virtual-scroll-for.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';

const COMPONENTS: any[] = [PagedVirtualScrollViewportComponent];

const DIRECTIVES: any[] = [PupaVirtualScrollForDirective];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [SharedModule, ScrollingModule],
  exports: [...COMPONENTS, ...DIRECTIVES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagedVirtualScrollModule {}
