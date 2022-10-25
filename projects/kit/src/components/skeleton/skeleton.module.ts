import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkeletonGroupComponent } from './components/skeleton-group/skeleton-group.component';
import { SkeletonLineComponent } from './components/skeleton-line/skeleton-line.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SkeletonComponent, SkeletonLineComponent, SkeletonGroupComponent],
  exports: [SkeletonComponent, SkeletonLineComponent, SkeletonGroupComponent],
})
export class PupaSkeletonModule {}
