import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '../../../../../src/public-api';
import { InfoBlockComponent } from './components/info-block/info-block.component';

@NgModule({
  declarations: [InfoBlockComponent],
  exports: [InfoBlockComponent],
  imports: [IconModule, CommonModule],
})
export class InfoBlockModule {}
