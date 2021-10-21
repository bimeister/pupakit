import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { IconModule } from '../icon/icon.module';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { DropdownMenuDirective } from './directives/dropdown-menu.directive';
import { DropdownMenuContentComponent } from './components/dropdown-menu-content/dropdown-menu-content.component';
import { DropdownMenuContainerComponent } from './components/dropdown-menu-container/dropdown-menu-container.component';
import { DropdownMenuItemComponent } from './components/dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuItemIconComponent } from './components/dropdown-menu-item-icon/dropdown-menu-item-icon.component';
import { DropdownMenuSeparatorComponent } from './components/dropdown-menu-separator/dropdown-menu-separator.component';

@NgModule({
  declarations: [
    DropdownMenuDirective,
    DropdownMenuContentComponent,
    DropdownMenuContainerComponent,
    DropdownMenuItemComponent,
    DropdownMenuItemIconComponent,
    DropdownMenuSeparatorComponent
  ],
  imports: [SharedModule, IconModule.forFeature(), OverlayModule, ScrollableModule],
  exports: [
    DropdownMenuDirective,
    DropdownMenuContentComponent,
    DropdownMenuItemComponent,
    DropdownMenuItemIconComponent,
    DropdownMenuSeparatorComponent
  ]
})
export class DropdownMenuModule {}
