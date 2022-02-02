import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DemoSharedModule } from '../../shared/shared.module';
import { LinkDemoRoutingModule } from './link-demo-routing.module';
import { LinkDemoComponent } from './link-demo.component';
import { BasicExampleComponent } from './examples/basic-example/basic-example.component';
import { ButtonAsLinkExampleComponent } from './examples/button-as-link-example/button-as-link-example.component';

@NgModule({
  declarations: [LinkDemoComponent, BasicExampleComponent, ButtonAsLinkExampleComponent],
  imports: [CommonModule, DemoSharedModule, LinkDemoRoutingModule],
})
export class LinkDemoModule {}
