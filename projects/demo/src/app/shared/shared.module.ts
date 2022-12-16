import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PupaCommonModule } from '@bimeister/pupakit.common';
import { PupaFormsModule } from '@bimeister/pupakit.forms';
import { getAllIcons, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaKitModule } from '@bimeister/pupakit.kit';
import { PupaAlertModule, PupaOverlaysModule } from '@bimeister/pupakit.overlays';
import { PupaTableModule } from '@bimeister/pupakit.table';
import { PupaTreeModule } from '@bimeister/pupakit.tree';
import { PupaWidgetsModule } from '@bimeister/pupakit.widgets';
import { AlertsToolbarExampleComponent } from '../pages/alerts-demo/examples/alerts-toolbar-example/alerts-toolbar-example.component';
import { AnchorModule } from './components/anchor/anchor.module';
import { CodeModule } from './components/code/code.module';
import { ExampleViewerModule } from './components/example-viewer/example-viewer.module';
import { InfoBlockModule } from './components/info-block/info-block.module';
import { PageModule } from './components/page/page.module';

const MODULES: Type<unknown>[] = [
  CommonModule,
  CodeModule,
  ExampleViewerModule,
  ReactiveFormsModule,
  InfoBlockModule,
  PageModule,
  AnchorModule,
  PupaTableModule,
  PupaCommonModule,
  PupaKitModule,
  PupaFormsModule,
  PupaTreeModule,
  PupaOverlaysModule,
  PupaWidgetsModule,
];

@NgModule({
  declarations: [],
  imports: [
    ...MODULES,
    PupaIconsModule.forRoot(getAllIcons()),
    PupaAlertModule.forRoot({ toolbarComponent: AlertsToolbarExampleComponent }),
  ],
  exports: [...MODULES, PupaIconsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DemoSharedModule {}
