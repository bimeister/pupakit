import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PagedVirtualScrollViewportComponent } from './components/paged-virtual-scroll-viewport/paged-virtual-scroll-viewport.component';
import { PupaVirtualScrollForDirective } from './directives/paged-virtual-scroll-for.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';

const COMPONENTS: any[] = [PagedVirtualScrollViewportComponent];

const DIRECTIVES: any[] = [PupaVirtualScrollForDirective];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [CommonModule, ScrollingModule],
  exports: [...COMPONENTS, ...DIRECTIVES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PupaPagedVirtualScrollModule {}
