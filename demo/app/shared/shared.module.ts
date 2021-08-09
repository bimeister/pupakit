import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { ExampleViewerModule } from './components/example-viewer/example-viewer.module';
import { CodeModule } from './components/code/code.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../../src/lib/components.module';
import { getAllIcons } from '../../declarations/functions/get-all-icons.function';
import { IconModule } from '../../../src/lib/components/icon/icon.module';

const MODULES: Type<unknown>[] = [CommonModule, CodeModule, ExampleViewerModule, ComponentsModule, ReactiveFormsModule];

@NgModule({
  imports: [...MODULES, IconModule.forRoot(getAllIcons())],
  exports: [...MODULES, IconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DemoSharedModule {}
