import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ColorsDemoRoutingModule } from './colors-demo-routing.module';
import { ColorsDemoComponent } from './colors-demo.component';

@NgModule({
  declarations: [ColorsDemoComponent],
  imports: [DemoSharedModule, ColorsDemoRoutingModule],
})
export class ColorsDemoModule {}
