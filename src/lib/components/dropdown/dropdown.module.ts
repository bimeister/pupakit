import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DropdownItemComponent } from './components/dropdown-item/dropdown-item.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [DropdownComponent, DropdownItemComponent],
  imports: [SharedModule, IconModule.forFeature()],
  exports: [DropdownComponent]
})
export class DropdownModule {}
