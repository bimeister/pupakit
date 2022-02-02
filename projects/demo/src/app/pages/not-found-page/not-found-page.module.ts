import { NgModule } from '@angular/core';
import { NotFoundPageComponent } from './not-found-page.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { NotFoundPageRoutingModule } from './not-found-page-routing.module';

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [DemoSharedModule, NotFoundPageRoutingModule],
})
export class NotFoundPageModule {}
