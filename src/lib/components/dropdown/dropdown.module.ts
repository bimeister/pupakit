import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DropdownItemComponent } from './components/dropdown-item/dropdown-item.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';

@NgModule({
  declarations: [DropdownComponent, DropdownItemComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DropdownComponent]
})
export class DropdownModule {}
