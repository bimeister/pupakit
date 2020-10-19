import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { ExpanderComponent } from './components/expander/expander.component';
import { ExpansibleComponent } from './components/expansible/expansible.component';

@NgModule({
  declarations: [ExpansibleComponent, ExpanderComponent],
  exports: [ExpansibleComponent, ExpanderComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExpansibleModule {}
