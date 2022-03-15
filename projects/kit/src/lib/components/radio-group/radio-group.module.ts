import { NgModule } from '@angular/core';
import { DirectivesModule } from '../../../internal/directives/directives.module';

import { SharedModule } from '../../../internal/shared/shared.module';
import { RadioControlComponent } from './components/radio-control/radio-control.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';

@NgModule({
  declarations: [RadioGroupComponent, RadioControlComponent],
  imports: [SharedModule, DirectivesModule],
  exports: [RadioGroupComponent, RadioControlComponent],
})
export class RadioGroupModule {}
