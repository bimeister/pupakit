import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SelectorDemoRoutingModule } from './selector-demo-routing.module';
import { SelectorDemoComponent } from './selector-demo.component';
import { SharedModule } from '@kit/internal/shared/shared.module';

@NgModule({
  declarations: [SelectorDemoComponent],
  imports: [DemoSharedModule, SelectorDemoRoutingModule, SharedModule],
})
export class SelectorDemoModule {}
