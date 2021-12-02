import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { PagedVirtualScrollDemoRoutingModule } from './paged-virtual-scroll-demo-routing.module';
import { PagedVirtualScrollDemoComponent } from './paged-virtual-scroll-demo.component';

@NgModule({
  declarations: [PagedVirtualScrollDemoComponent],
  imports: [DemoSharedModule, PagedVirtualScrollDemoRoutingModule],
})
export class PagedVirtualScrollDemoModule {}
