import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TextareaExample1Component } from './examples/example-1/example-1.component';
import { TextareaExample2Component } from './examples/example-2/example-2.component';
import { TextareaExample3Component } from './examples/example-3/example-3.component';
import { TextareaExample4Component } from './examples/example-4/example-4.component';
import { TextareaExample5Component } from './examples/example-5/example-5.component';
import { TextareaExample6Component } from './examples/example-6/example-6.component';
import { TextareaExample7Component } from './examples/example-7/example-7.component';
import { TextareaExample8Component } from './examples/example-8/example-8.component';
import { TextareaExample9Component } from './examples/example-9/example-9.component';
import { TextareaDemoRoutingModule } from './textarea-demo-routing.module';
import { TextareaDemoComponent } from './textarea-demo.component';
import { PupaTextareaModule } from '@bimeister/pupakit.forms';

const EXAMPLES: Type<unknown>[] = [
  TextareaExample1Component,
  TextareaExample2Component,
  TextareaExample3Component,
  TextareaExample4Component,
  TextareaExample5Component,
  TextareaExample6Component,
  TextareaExample7Component,
  TextareaExample8Component,
  TextareaExample9Component,
];
const COMPONENTS: Type<unknown>[] = [TextareaDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [DemoSharedModule, TextareaDemoRoutingModule, PupaTextareaModule],
})
export class TextareaDemoModule {}
