import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SpinnerDemoRoutingModule } from './spinner-demo-routing.module';
import { SpinnerDemoComponent } from './spinner-demo.component';
import { DemoPlainSpinnerComponent } from './examples/demo-plain-spinner/demo-plain-spinner.component';
import { DemoLoaderComponent } from './examples/demo-loader/demo-loader.component';
import { DemoBagelSpinnerComponent } from './examples/demo-bagel-spinner/demo-bagel-spinner.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [SpinnerDemoComponent, DemoPlainSpinnerComponent, DemoLoaderComponent, DemoBagelSpinnerComponent],
  imports: [DemoSharedModule, SpinnerDemoRoutingModule, FormsModule],
})
export class SpinnerDemoModule {}
