import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { IconModule } from '../icon/icon.module';
import { LinkComponent } from './components/link/link.component';

const EXPORTS: Type<unknown>[] = [LinkComponent];

@NgModule({
  declarations: [...EXPORTS],
  imports: [CommonModule, IconModule.forFeature()],
  exports: EXPORTS,
})
export class LinkModule {}
