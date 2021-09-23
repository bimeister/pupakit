import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TileDemoRoutingModule } from './tile-demo-routing.module';
import { TileDemoComponent } from './tile-demo.component';

@NgModule({
  declarations: [TileDemoComponent],
  imports: [DemoSharedModule, TileDemoRoutingModule]
})
export class TileDemoModule {}
