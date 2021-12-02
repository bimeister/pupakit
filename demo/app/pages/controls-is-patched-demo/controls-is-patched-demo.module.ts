import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ControlsIsPatchedDemoRoutingModule } from './controls-is-patched-demo-routing.module';
import { ControlsIsPatchedDemoComponent } from './controls-is-patched-demo.component';

@NgModule({
  declarations: [ControlsIsPatchedDemoComponent],
  imports: [DemoSharedModule, ControlsIsPatchedDemoRoutingModule],
})
export class ControlsIsPatchedDemoModule {}
