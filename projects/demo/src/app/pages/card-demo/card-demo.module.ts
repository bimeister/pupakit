import { NgModule } from '@angular/core';
import { CheckboxModule } from '@kit/lib/components/checkbox/checkbox.module';
import { DemoSharedModule } from '../../shared/shared.module';
import { CardDemoRoutingModule } from './card-demo-routing.module';
import { CardDemoComponent } from './card-demo.component';
import { CardDemoExample1Component } from './examples/example-1/example-1.component';
import { CardDemoExample2Component } from './examples/example-2/example-2.component';
import { CardDemoExample3Component } from './examples/example-3/example-3.component';
import { IconHolderModule } from '@kit/lib/components/icon-holder/icon-holder.module';

@NgModule({
  declarations: [CardDemoComponent, CardDemoExample1Component, CardDemoExample2Component, CardDemoExample3Component],
  imports: [DemoSharedModule, CardDemoRoutingModule, CheckboxModule, IconHolderModule],
})
export class CardDemoModule {}
