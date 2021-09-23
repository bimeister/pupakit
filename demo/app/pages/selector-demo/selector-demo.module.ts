import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SelectorDemoRoutingModule } from './selector-demo-routing.module';
import { SelectorDemoComponent } from './selector-demo.component';

@NgModule({
  declarations: [SelectorDemoComponent],
  imports: [DemoSharedModule, SelectorDemoRoutingModule]
})
export class SelectorDemoModule {}
