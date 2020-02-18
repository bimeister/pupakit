import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AngularComponent, SharedModule } from '../../internal';
import {
  AlertComponent,
  CloseButtonComponent,
  DrawerPaneComponent,
  LayoutComponent,
  LoaderComponent,
  ModalWindowComponent,
  OverlayComponent
} from './components';

const COMPONENTS: AngularComponent[] = [
  AlertComponent,
  CloseButtonComponent,
  DrawerPaneComponent,
  LayoutComponent,
  LoaderComponent,
  ModalWindowComponent,
  OverlayComponent
];

@NgModule({
  imports: [SharedModule],
  declarations: [...COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [LayoutComponent, LoaderComponent]
})
export class LayoutModule {}
