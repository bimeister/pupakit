import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { RatingDemoRoutingModule } from './rating-demo-routing.module';
import { RatingDemoComponent } from './rating-demo.component';

@NgModule({
  declarations: [RatingDemoComponent],
  imports: [DemoSharedModule, RatingDemoRoutingModule],
})
export class RatingDemoModule {}
