import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { DropdownMenuTriggerComponent } from './components/dropdown-menu-trigger/dropdown-menu-trigger.component';
import { DropdownMenuItemComponent } from './components/dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuContentComponent } from './components/dropdown-menu-content/dropdown-menu-content.component';

@NgModule({
  declarations: [
    DropdownMenuComponent,
    DropdownMenuTriggerComponent,
    DropdownMenuContentComponent,
    DropdownMenuItemComponent
  ],
  imports: [SharedModule],
  exports: [
    DropdownMenuComponent,
    DropdownMenuTriggerComponent,
    DropdownMenuContentComponent,
    DropdownMenuItemComponent
  ]
})
export class DropdownMenuModule {}
