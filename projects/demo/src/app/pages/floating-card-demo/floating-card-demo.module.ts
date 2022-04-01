import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { FloatingCardDemoRoutingModule } from './floating-card-demo-routing.module';
import { FloatingCardDemoComponent } from './floating-card-demo.component';
import { DemoFloatingCardExampleComponent } from './examples/demo-floating-card-example/demo-floating-card-example.component';
import { DemoFloatingCardWithCustomResetTypeExampleComponent } from './examples/demo-floating-card-with-custom-reset-type-example/demo-floating-card-with-custom-reset-type-example.component';

@NgModule({
  declarations: [
    FloatingCardDemoComponent,
    DemoFloatingCardExampleComponent,
    DemoFloatingCardWithCustomResetTypeExampleComponent,
  ],
  imports: [DemoSharedModule, FloatingCardDemoRoutingModule],
})
export class FloatingCardDemoModule {}
