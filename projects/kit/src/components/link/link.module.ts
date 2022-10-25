import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaIconModule } from '../icon/icon.module';

import { LinkComponent } from './components/link/link.component';

const EXPORTS: Type<unknown>[] = [LinkComponent];

@NgModule({
  declarations: [...EXPORTS],
  imports: [CommonModule, PupaIconModule, PupaIconsModule.forFeature()],
  exports: EXPORTS,
})
export class PupaLinkModule {}
