import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { BadgeContentComponent } from './components/badge-content/badge-content.component';
import { BadgeIndicatorComponent } from './components/badge-indicator/badge-indicator.component';
import { BadgeMarkerComponent } from './components/badge-marker/badge-marker.component';
import { BadgeComponent } from './components/badge/badge.component';

@NgModule({
  declarations: [BadgeComponent, BadgeContentComponent, BadgeMarkerComponent, BadgeIndicatorComponent],
  imports: [SharedModule, IconModule],
  exports: [BadgeComponent, BadgeContentComponent, BadgeMarkerComponent, BadgeIndicatorComponent]
})
export class BadgeModule {}
