import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { TileComponent } from './components/tile/tile.component';

@NgModule({
  declarations: [TileComponent],
  imports: [SharedModule],
  exports: [TileComponent]
})
export class TileModule {}
