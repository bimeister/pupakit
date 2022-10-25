import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaButtonsModule } from '@bimeister/pupakit.kit';
import { AnchorComponent } from './components/anchor/anchor.component';

@NgModule({
  declarations: [AnchorComponent],
  imports: [CommonModule, PupaButtonsModule],
  exports: [AnchorComponent],
})
export class AnchorModule {}
