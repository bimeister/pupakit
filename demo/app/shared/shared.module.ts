import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '../../../src/lib/components.module';
import { IconModule } from '../../../src/lib/components/icon/icon.module';
import { AlertModule } from '../../../src/public-api';
import { getAllIcons } from '../../declarations/functions/get-all-icons.function';
import { AlertsToolbarExampleComponent } from '../pages/alerts-demo/examples/alerts-toolbar-example/alerts-toolbar-example.component';
import { CodeModule } from './components/code/code.module';
import { ExampleViewerModule } from './components/example-viewer/example-viewer.module';
import { InfoBlockModule } from './components/info-block/info-block.module';
import { PageModule } from './components/page/page.module';

const MODULES: Type<unknown>[] = [
  CommonModule,
  CodeModule,
  ExampleViewerModule,
  ComponentsModule,
  ReactiveFormsModule,
  InfoBlockModule,
  PageModule,
];

@NgModule({
  declarations: [],
  imports: [
    ...MODULES,
    IconModule.forRoot(getAllIcons()),
    AlertModule.forRoot({ toolbarComponent: AlertsToolbarExampleComponent }),
  ],
  exports: [...MODULES, IconModule, AlertModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DemoSharedModule {}
