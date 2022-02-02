import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ScrollbarDemoRoutingModule } from './scrollbar-demo-routing.module';
import { ScrollbarDemoComponent } from './scrollbar-demo.component';

@NgModule({
  declarations: [ScrollbarDemoComponent],
  imports: [DemoSharedModule, ScrollbarDemoRoutingModule],
})
export class ScrollbarDemoModule {}
