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
import { ModalDemoExample5Component } from './examples/modal-demo-example-5/modal-content/modal-demo-example-5.component';
import { ModalDemoExample5HelperComponent } from './examples/modal-demo-example-5/modal-demo-example-5-helper/modal-demo-example-5-helper.component';
import { ModalDemoContentComponent } from './modal-demo-content/modal-demo-content.component';
import { ModalDemoRoutingModule } from './modal-demo-routing.module';
import { ModalDemoComponent } from './modal-demo.component';
import { ModalDemoExample6Component } from './examples/modal-demo-example-6/modal-content/modal-demo-example-6.component';
import { ModalDemoExample6HelperComponent } from './examples/modal-demo-example-6/modal-demo-example-6-helper/modal-demo-example-6-helper.component';
import { ModalDemoExample7Component } from './examples/modal-demo-example-7/modal-content/modal-demo-example-7.component';
import { ModalDemoExample7HelperComponent } from './examples/modal-demo-example-7/modal-demo-example-7-helper/modal-demo-example-7-helper.component';

const EXAMPLES: Type<unknown>[] = [
  ModalDemoExample1Component,
  ModalDemoExample1HelperComponent,
  ModalDemoExample2Component,
  ModalDemoExample2HelperComponent,
  ModalDemoExample3Component,
  ModalDemoExample3HelperComponent,
  ModalDemoExample4Component,
  ModalDemoExample4HelperComponent,
  ModalDemoExample5Component,
  ModalDemoExample5HelperComponent,
  ModalDemoExample6Component,
  ModalDemoExample6HelperComponent,
  ModalDemoExample7Component,
  ModalDemoExample7HelperComponent,
];

@NgModule({
  declarations: [ModalDemoComponent, ModalDemoContentComponent, ...EXAMPLES],
  imports: [DemoSharedModule, ModalDemoRoutingModule],
})
export class ModalDemoModule {}
