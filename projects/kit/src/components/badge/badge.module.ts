import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { BadgeIndicatorComponent } from './components/badge-indicator/badge-indicator.component';
import { BadgeMarkerBlockComponent } from './components/badge-marker-block/badge-marker-block.component';
import { BadgeMarkerComponent } from './components/badge-marker/badge-marker.component';
import { BadgeComponent } from './components/badge/badge.component';

@NgModule({
  declarations: [BadgeComponent, BadgeMarkerComponent, BadgeIndicatorComponent, BadgeMarkerBlockComponent],
  imports: [CommonModule, PupaIconsModule],
  exports: [BadgeComponent, BadgeMarkerComponent, BadgeIndicatorComponent, BadgeMarkerBlockComponent],
})
export class PupaBadgeModule {}
