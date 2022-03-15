import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { PopoverContainerComponent } from './components/popover-container/popover-container.component';
import { PopoverLayoutActionComponent } from './components/popover-layout-action/popover-layout-action.component';
import { PopoverLayoutBodyComponent } from './components/popover-layout-body/popover-layout-body.component';
import { PopoverLayoutCloseButtonComponent } from './components/popover-layout-close-button/popover-layout-close-button.component';
import { PopoverLayoutFooterComponent } from './components/popover-layout-footer/popover-layout-footer.component';
import { PopoverLayoutHeaderComponent } from './components/popover-layout-header/popover-layout-header.component';
import { PopoverLayoutComponent } from './components/popover-layout/popover-layout.component';

const DECLARATIONS: Type<unknown>[] = [PopoverContainerComponent];

const EXPORTS: Type<unknown>[] = [
  PopoverLayoutComponent,
  PopoverLayoutBodyComponent,
  PopoverLayoutHeaderComponent,
  PopoverLayoutFooterComponent,
  PopoverLayoutCloseButtonComponent,
  PopoverLayoutActionComponent,
];

@NgModule({
  declarations: [...DECLARATIONS, ...EXPORTS],
  imports: [SharedModule, IconButtonModule, OverlayModule, PortalModule, ScrollableModule, ThemeWrapperModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...EXPORTS, OverlayModule, PortalModule],
})
export class PopoverModule {}
