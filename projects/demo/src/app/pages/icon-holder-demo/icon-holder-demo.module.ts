import { NgModule } from '@angular/core';
import { IconHolderDemoComponent } from './icon-holder-demo.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { IconHolderDemoRoutingModule } from './icon-holder-demo-routing.module';
import { Example1Component } from './examples/example-1/example-1.component';

@NgModule({
  declarations: [IconHolderDemoComponent, Example1Component],
  imports: [DemoSharedModule, IconHolderDemoRoutingModule],
})
export class IconHolderDemoModule {}
