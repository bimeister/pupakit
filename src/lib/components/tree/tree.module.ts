import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SkeletonModule } from '../skeleton/skeleton.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { TreeComponent } from './components/tree/tree.component';

@NgModule({
  declarations: [TreeComponent],
  imports: [SharedModule, SkeletonModule, SpinnerModule, ScrollingModule, CdkTreeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TreeComponent]
})
export class TreeModule {}
