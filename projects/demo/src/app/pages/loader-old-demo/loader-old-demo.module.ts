import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { LoaderOldDemoRoutingModule } from './loader-old-demo-routing.module';
import { LoaderOldDemoComponent } from './loader-old-demo.component';

@NgModule({
  declarations: [LoaderOldDemoComponent],
  imports: [DemoSharedModule, LoaderOldDemoRoutingModule],
})
export class LoaderOldDemoModule {}
