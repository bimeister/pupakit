import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { DROPDOWN_MENU_SERVICE_TOKEN } from '../../../internal/constants/tokens/dropdown-menu-service.token';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { DropdownMenuContainerComponent } from './components/dropdown-menu-container/dropdown-menu-container.component';
import { DropdownMenuContentComponent } from './components/dropdown-menu-content/dropdown-menu-content.component';
import { DropdownMenuItemComponent } from './components/dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuSeparatorComponent } from './components/dropdown-menu-separator/dropdown-menu-separator.component';
import { DropdownMenuDirective } from './directives/dropdown-menu.directive';
import { DropdownMenuService } from './services/dropdown-menu.service';
import { OptionModule } from '../option/option.module';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';

@NgModule({
  declarations: [
    DropdownMenuDirective,
    DropdownMenuContentComponent,
    DropdownMenuContainerComponent,
    DropdownMenuItemComponent,
    DropdownMenuSeparatorComponent,
  ],
  imports: [SharedModule, IconModule.forFeature(), OverlayModule, ScrollableModule, OptionModule, ThemeWrapperModule],
  exports: [
    DropdownMenuDirective,
    DropdownMenuContentComponent,
    DropdownMenuItemComponent,
    DropdownMenuSeparatorComponent,
  ],
  providers: [
    DropdownMenuService,
    {
      provide: DROPDOWN_MENU_SERVICE_TOKEN,
      useExisting: DropdownMenuService,
    },
  ],
})
export class DropdownMenuModule {}
