import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../internal/shared/shared.module';
import { TileComponent } from './components/tile/tile.component';

@NgModule({
  declarations: [TileComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TileComponent]
})
export class TileModule {}
