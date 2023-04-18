import { NgModule } from '@angular/core';
import { IconHolderDemoComponent } from './icon-holder-demo.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { IconHolderDemoRoutingModule } from './icon-holder-demo-routing.module';
import { Example1Component } from './examples/example-1/example-1.component';
import { Example2Component } from './examples/example-2/example-2.component';

@NgModule({
  declarations: [IconHolderDemoComponent, Example1Component, Example2Component],
  imports: [DemoSharedModule, IconHolderDemoRoutingModule],
})
export class IconHolderDemoModule {}
