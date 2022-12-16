import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { LabelComponent } from './components/label/label.component';

const EXPORTS: any[] = [LabelComponent];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule, PupaIconsModule],
  exports: [...EXPORTS],
})
export class PupaLabelModule {}
