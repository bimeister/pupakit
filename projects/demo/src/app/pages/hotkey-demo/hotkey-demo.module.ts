import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { HotkeyDemoComponent } from './hotkey-demo.component';
import { HotkeyDemoRoutingModule } from './hotkey-demo-routing.module';
import { HotkeyExample1Component } from './examples/example-1/example-1.component';
import { HotkeyExample2Component } from './examples/example-2/example-2.component';
import { PupaHotkeyModule } from '@bimeister/pupakit.kit/components/hotkey/hotkey.module';

@NgModule({
  declarations: [HotkeyDemoComponent, HotkeyExample1Component, HotkeyExample2Component],
  imports: [DemoSharedModule, HotkeyDemoRoutingModule, PupaHotkeyModule],
})
export class HotkeyDemoModule {}
