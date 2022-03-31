import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ModalDemoExample1Component } from './examples/modal-demo-example-1/modal-content/modal-demo-example-1.component';
import { ModalDemoExample1HelperComponent } from './examples/modal-demo-example-1/modal-demo-example-1-helper/modal-demo-example-1-helper.component';
import { ModalDemoExample2Component } from './examples/modal-demo-example-2/modal-content/modal-demo-example-2.component';
import { ModalDemoExample2HelperComponent } from './examples/modal-demo-example-2/modal-demo-example-2-helper/modal-demo-example-2-helper.component';
import { ModalDemoExample3Component } from './examples/modal-demo-example-3/modal-content/modal-demo-example-3.component';
import { ModalDemoExample3HelperComponent } from './examples/modal-demo-example-3/modal-demo-example-3-helper/modal-demo-example-3-helper.component';
import { ModalDemoExample4Component } from './examples/modal-demo-example-4/modal-content/modal-demo-example-4.component';
import { ModalDemoExample4HelperComponent } from './examples/modal-demo-example-4/modal-demo-example-4-helper/modal-demo-example-4-helper.component';
import { ModalDemoContentComponent } from './modal-demo-content/modal-demo-content.component';
import { ModalDemoRoutingModule } from './modal-demo-routing.module';
import { ModalDemoComponent } from './modal-demo.component';

const EXAMPLES: Type<unknown>[] = [
  ModalDemoExample1Component,
  ModalDemoExample1HelperComponent,
  ModalDemoExample2Component,
  ModalDemoExample2HelperComponent,
  ModalDemoExample3Component,
  ModalDemoExample3HelperComponent,
  ModalDemoExample4Component,
  ModalDemoExample4HelperComponent,
];

@NgModule({
  declarations: [ModalDemoComponent, ModalDemoContentComponent, ...EXAMPLES],
  imports: [DemoSharedModule, ModalDemoRoutingModule],
})
export class ModalDemoModule {}
