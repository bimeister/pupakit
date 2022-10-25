import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaIconModule } from '@bimeister/pupakit.kit';
import { InfoBlockComponent } from './components/info-block/info-block.component';

@NgModule({
  declarations: [InfoBlockComponent],
  exports: [InfoBlockComponent],
  imports: [PupaIconModule, CommonModule],
})
export class InfoBlockModule {}
