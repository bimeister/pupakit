import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { InfoBlockComponent } from './components/info-block/info-block.component';

@NgModule({
  declarations: [InfoBlockComponent],
  exports: [InfoBlockComponent],
  imports: [PupaIconsModule, CommonModule],
})
export class InfoBlockModule {}
