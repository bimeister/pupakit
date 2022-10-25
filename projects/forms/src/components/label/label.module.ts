import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaIconModule } from '@bimeister/pupakit.kit';
import { LabelComponent } from './components/label/label.component';

const EXPORTS: any[] = [LabelComponent];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule, PupaIconModule],
  exports: [...EXPORTS],
})
export class PupaLabelModule {}
