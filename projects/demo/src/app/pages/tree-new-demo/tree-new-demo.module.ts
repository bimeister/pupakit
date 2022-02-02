import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TreeNewDemoRoutingModule } from './tree-new-demo-routing.module';
import { TreeNewDemoComponent } from './tree-new-demo.component';

@NgModule({
  declarations: [TreeNewDemoComponent],
  imports: [DemoSharedModule, TreeNewDemoRoutingModule],
})
export class TreeNewDemoModule {}
