import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { DropdownMenuItemComponent } from './components/dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuSeparatorComponent } from './components/dropdown-menu-separator/dropdown-menu-separator.component';

import { CommonModule } from '@angular/common';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaOptionModule } from '../option/option.module';
import { PupaScrollableModule } from '../scrollable/scrollable.module';
import { PupaThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';

@NgModule({
  declarations: [DropdownMenuComponent, DropdownMenuItemComponent, DropdownMenuSeparatorComponent],
  imports: [
    CommonModule,
    PupaIconsModule.forFeature(),
    OverlayModule,
    PupaScrollableModule,
    PupaOptionModule,
    PupaThemeWrapperModule,
  ],
  exports: [DropdownMenuComponent, DropdownMenuItemComponent, DropdownMenuSeparatorComponent],
})
export class PupaDropdownMenuModule {}
