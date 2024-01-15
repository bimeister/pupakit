import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ColorsDemoRoutingModule } from './colors-demo-routing.module';
import { ColorsDemoComponent } from './colors-demo.component';
import { ColorsColorUsageExampleComponent } from './examples/color-usage-example/color-usage-example.component';
import { ColorsExample1Component } from './examples/example-1/example-1.component';
import { ColorsExample2Component } from './examples/example-2/example-2.component';
import { ColorsSemanticColorUsageExampleComponent } from './examples/semantic-color-usage-example/semantic-color-usage-example.component';
import { ColorsVisualizationColorUsageExample1Component } from './examples/visualization-color-usage-example-1/visualization-color-usage-example-1.component';
import { ColorsVisualizationColorUsageExample2Component } from './examples/visualization-color-usage-example-2/visualization-color-usage-example-2.component';

const EXAMPLES: Type<unknown>[] = [
  ColorsExample1Component,
  ColorsExample2Component,
  ColorsVisualizationColorUsageExample1Component,
  ColorsVisualizationColorUsageExample2Component,
  ColorsSemanticColorUsageExampleComponent,
  ColorsColorUsageExampleComponent,
];
const COMPONENTS: Type<unknown>[] = [ColorsDemoComponent];
const DECLARATIONS: Type<unknown>[] = [...COMPONENTS, ...EXAMPLES];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [DemoSharedModule, ColorsDemoRoutingModule],
})
export class ColorsDemoModule {}
