import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { RadioControlLabelComponent } from './components/radio-control-label/radio-control-label.component';
import { RadioControlMarkerComponent } from './components/radio-control-marker/radio-control-marker.component';
import { RadioControlComponent } from './components/radio-control/radio-control.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';

@NgModule({
  declarations: [RadioGroupComponent, RadioControlComponent, RadioControlLabelComponent, RadioControlMarkerComponent],
  imports: [SharedModule],
  exports: [RadioGroupComponent, RadioControlComponent, RadioControlLabelComponent, RadioControlMarkerComponent],
})
export class RadioGroupModule {}
