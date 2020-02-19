import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { DropdownModule } from '../dropdown/dropdown.module';
import { SharedModule } from './../../internal/shared/shared.module';
import { SelectComponent } from './components/select/select.component';

@NgModule({
  declarations: [SelectComponent],
  imports: [SharedModule, DropdownModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [SelectComponent]
})
export class SelectModule {}
