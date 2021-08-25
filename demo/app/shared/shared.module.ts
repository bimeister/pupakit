import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { ExampleViewerModule } from './components/example-viewer/example-viewer.module';
import { CodeModule } from './components/code/code.module';

const MODULES: Type<unknown>[] = [CodeModule, ExampleViewerModule];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DemoSharedModule {}
