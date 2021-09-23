import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { LoaderDemoRoutingModule } from './loader-demo-routing.module';
import { LoaderDemoComponent } from './loader-demo.component';

@NgModule({
  declarations: [LoaderDemoComponent],
  imports: [DemoSharedModule, LoaderDemoRoutingModule]
})
export class LoaderDemoModule {}
