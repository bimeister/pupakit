import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { UploadsDemoRoutingModule } from './uploads-demo-routing.module';
import { UploadsDemoComponent } from './uploads-demo.component';

@NgModule({
  declarations: [UploadsDemoComponent],
  imports: [DemoSharedModule, UploadsDemoRoutingModule],
})
export class UploadsDemoModule {}
