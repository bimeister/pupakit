import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { DropdownMenuItemComponent } from './components/dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuSeparatorComponent } from './components/dropdown-menu-separator/dropdown-menu-separator.component';

import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { CommonModule } from '@angular/common';
import { PupaIconModule } from '../icon/icon.module';
import { PupaScrollableModule } from '../scrollable/scrollable.module';
import { PupaOptionModule } from '../option/option.module';
import { PupaThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';

@NgModule({
  declarations: [DropdownMenuComponent, DropdownMenuItemComponent, DropdownMenuSeparatorComponent],
  imports: [
    CommonModule,
    PupaIconModule,
    PupaIconsModule.forFeature(),
    OverlayModule,
    PupaScrollableModule,
    PupaOptionModule,
    PupaThemeWrapperModule,
  ],
  exports: [DropdownMenuComponent, DropdownMenuItemComponent, DropdownMenuSeparatorComponent],
})
export class PupaDropdownMenuModule {}
