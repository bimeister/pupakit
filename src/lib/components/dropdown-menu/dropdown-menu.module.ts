import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { IconModule } from '../icon/icon.module';
import { SharedModule } from '../../../internal/shared/shared.module';
import { DropdownMenuItemIconComponent } from './components/dropdown-menu-item-icon/dropdown-menu-item-icon.component';
import { DropdownMenuSeparatorComponent } from './components/dropdown-menu-separator/dropdown-menu-separator.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { DropdownMenuTriggerComponent } from './components/dropdown-menu-trigger/dropdown-menu-trigger.component';
import { DropdownMenuItemComponent } from './components/dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuContentComponent } from './components/dropdown-menu-content/dropdown-menu-content.component';
import { ScrollableModule } from '../scrollable/scrollable.module';

@NgModule({
  declarations: [
    DropdownMenuComponent,
    DropdownMenuTriggerComponent,
    DropdownMenuContentComponent,
    DropdownMenuSeparatorComponent,
    DropdownMenuItemComponent,
    DropdownMenuItemIconComponent
  ],
  imports: [SharedModule, IconModule, OverlayModule, ScrollableModule],
  exports: [
    DropdownMenuComponent,
    DropdownMenuTriggerComponent,
    DropdownMenuContentComponent,
    DropdownMenuSeparatorComponent,
    DropdownMenuItemComponent,
    DropdownMenuItemIconComponent
  ]
})
export class DropdownMenuModule {}
