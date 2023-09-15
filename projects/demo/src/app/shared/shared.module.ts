import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PupaCalendarModule } from '@bimeister/pupakit.calendar';
import { PupaCommonModule } from '@bimeister/pupakit.common';
import { PupaDndModule } from '@bimeister/pupakit.dnd';
import { PupaFormsModule } from '@bimeister/pupakit.forms';
import { getAllIcons, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaKitModule } from '@bimeister/pupakit.kit';
import { PupaAlertModule, PupaOverlaysModule, ThemeBehavior } from '@bimeister/pupakit.overlays';
import { PupaTableModule } from '@bimeister/pupakit.table';
import { PupaTreeModule } from '@bimeister/pupakit.tree';
import { PupaWidgetsModule } from '@bimeister/pupakit.widgets';
import { AlertsToolbarExampleComponent } from '../pages/alerts-demo/examples/alerts-toolbar-example/alerts-toolbar-example.component';
import { AnchorModule } from './components/anchor/anchor.module';
import { CodeModule } from './components/code/code.module';
import { ExampleViewerModule } from './components/example-viewer/example-viewer.module';
import { PageModule } from './components/page/page.module';

const MODULES: Type<unknown>[] = [
  CommonModule,
  CodeModule,
  ExampleViewerModule,
  ReactiveFormsModule,
  PageModule,
  AnchorModule,
  PupaTableModule,
  PupaCommonModule,
  PupaKitModule,
  PupaFormsModule,
  PupaTreeModule,
  PupaOverlaysModule,
  PupaWidgetsModule,
  PupaDndModule,
  PupaCalendarModule,
];

@NgModule({
  declarations: [],
  imports: [
    ...MODULES,
    PupaIconsModule.forRoot(getAllIcons()),
    PupaAlertModule.forRoot({ toolbarComponent: AlertsToolbarExampleComponent, themeBehaviour: ThemeBehavior.Inherit }),
  ],
  exports: [...MODULES, PupaIconsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DemoSharedModule {}
