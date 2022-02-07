import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { InputDemoRoutingModule } from './input-demo-routing.module';
import { InputDemoComponent } from './input-demo.component';
import { DirectivesModule } from '../../../../src/internal/directives/directives.module';

@NgModule({
  declarations: [InputDemoComponent],
  imports: [DemoSharedModule, InputDemoRoutingModule, DirectivesModule],
})
export class InputDemoModule {}
