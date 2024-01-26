import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { LoaderDemoRoutingModule } from './loader-demo-routing.module';
import { LoaderDemoComponent } from './loader-demo.component';
import { DemoLoaderComponent } from './examples/demo-loader/demo-loader.component';
import { DemoLoaderOldComponent } from './examples/demo-loader-old/demo-loader-old.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoaderDemoComponent, DemoLoaderComponent, DemoLoaderOldComponent],
  imports: [DemoSharedModule, LoaderDemoRoutingModule, FormsModule],
})
export class LoaderDemoModule {}
