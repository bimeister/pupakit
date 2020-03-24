import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { SkeletonGroupComponent } from './components/skeleton-group/skeleton-group.component';
import { SkeletonLineComponent } from './components/skeleton-line/skeleton-line.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';

@NgModule({
  imports: [SharedModule],
  declarations: [SkeletonComponent, SkeletonLineComponent, SkeletonGroupComponent],
  exports: [SkeletonComponent, SkeletonLineComponent, SkeletonGroupComponent]
})
export class SkeletonModule {}
