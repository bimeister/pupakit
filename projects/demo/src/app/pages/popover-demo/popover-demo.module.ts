import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { PopoverLayoutBasicComponent } from './examples/basic-example/popover-layout-basic/popover-layout-basic.component';
import { PopoverTriggerBasicComponent } from './examples/basic-example/popover-trigger-basic/popover-trigger-basic.component';
import { PopoverLayoutCoordinatesComponent } from './examples/coordinates-example/popover-layout-coordinates/popover-layout-coordinates.component';
import { PopoverTriggerCoordinatesComponent } from './examples/coordinates-example/popover-trigger-coordinates/popover-trigger-coordinates.component';
import { DrawerLayoutOtherComponent } from './examples/other-example/drawer-layout-other/drawer-layout-other.component';
import { PopoverLayoutOtherComponent } from './examples/other-example/popover-layout-other/popover-layout-other.component';
import { PopoverTriggerOtherComponent } from './examples/other-example/popover-trigger-other/popover-trigger-other.component';
import { PopoverDemoRoutingModule } from './popover-demo-routing.module';
import { PopoverDemoComponent } from './popover-demo.component';

const COMPONENTS: Type<unknown>[] = [
  PopoverDemoComponent,
  PopoverLayoutBasicComponent,
  PopoverTriggerBasicComponent,
  PopoverLayoutCoordinatesComponent,
  PopoverTriggerCoordinatesComponent,
  PopoverLayoutOtherComponent,
  PopoverTriggerOtherComponent,
  DrawerLayoutOtherComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [DemoSharedModule, PopoverDemoRoutingModule],
})
export class PopoverDemoModule {}
