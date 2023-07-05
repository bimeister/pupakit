import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';

import { LinkComponent } from './components/link/link.component';

const EXPORTS: Type<unknown>[] = [LinkComponent];
@NgModule({
  declarations: [...EXPORTS],
  imports: [CommonModule, PupaIconsModule.forFeature()],
  exports: EXPORTS,
})
export class PupaLinkModule {}
