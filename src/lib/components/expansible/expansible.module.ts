import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { ExpanderComponent } from './components/expander/expander.component';
import { ExpansibleComponent } from './components/expansible/expansible.component';

@NgModule({
  declarations: [ExpansibleComponent, ExpanderComponent],
  exports: [ExpansibleComponent, ExpanderComponent],
  imports: [SharedModule],
})
export class ExpansibleModule {}
