import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaCalloutComponent } from './components/callout/callout.component';
import { PupaButtonsModule } from '../buttons/buttons.module';

@NgModule({
  declarations: [PupaCalloutComponent],
  exports: [PupaCalloutComponent],
  imports: [PupaIconsModule, PupaButtonsModule, CommonModule],
})
export class PupaCalloutModule {}
