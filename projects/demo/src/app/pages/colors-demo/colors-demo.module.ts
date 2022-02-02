import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ColorsDemoRoutingModule } from './colors-demo-routing.module';
import { ColorsDemoComponent } from './colors-demo.component';
import { ColorsExample1Component } from './examples/example-1/example-1.component';
import { ColorsExample2Component } from './examples/example-2/example-2.component';

@NgModule({
  declarations: [ColorsDemoComponent, ColorsExample1Component, ColorsExample2Component],
  imports: [DemoSharedModule, ColorsDemoRoutingModule],
})
export class ColorsDemoModule {}
