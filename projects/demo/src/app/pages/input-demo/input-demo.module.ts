import { NgModule } from '@angular/core';
import { DirectivesModule } from '@kit/internal/directives/directives.module';
import { DemoSharedModule } from '../../shared/shared.module';
import { InputDemoRoutingModule } from './input-demo-routing.module';
import { InputDemoComponent } from './input-demo.component';

@NgModule({
  declarations: [InputDemoComponent],
  imports: [DemoSharedModule, InputDemoRoutingModule, DirectivesModule],
})
export class InputDemoModule {}
