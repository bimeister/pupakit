import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ModalDemoRoutingModule } from './modal-demo-routing.module';
import { ModalDemoComponent } from './modal-demo.component';

@NgModule({
  declarations: [ModalDemoComponent],
  imports: [DemoSharedModule, ModalDemoRoutingModule]
})
export class ModalDemoModule {}
