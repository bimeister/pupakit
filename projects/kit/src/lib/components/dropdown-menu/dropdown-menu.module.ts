import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { DropdownMenuItemComponent } from './components/dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuSeparatorComponent } from './components/dropdown-menu-separator/dropdown-menu-separator.component';

import { OptionModule } from '../option/option.module';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';

@NgModule({
  declarations: [DropdownMenuComponent, DropdownMenuItemComponent, DropdownMenuSeparatorComponent],
  imports: [SharedModule, IconModule.forFeature(), OverlayModule, ScrollableModule, OptionModule, ThemeWrapperModule],
  exports: [DropdownMenuComponent, DropdownMenuItemComponent, DropdownMenuSeparatorComponent],
})
export class DropdownMenuModule {}
