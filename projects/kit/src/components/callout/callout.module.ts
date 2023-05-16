import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaCalloutComponent } from './components/callout/callout.component';

@NgModule({
  declarations: [PupaCalloutComponent],
  exports: [PupaCalloutComponent],
  imports: [PupaIconsModule, CommonModule],
})
export class PupaCalloutModule {}
