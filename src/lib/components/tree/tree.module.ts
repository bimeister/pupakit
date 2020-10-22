import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';

import { SkeletonModule } from '../skeleton/skeleton.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { TreeComponent } from './components/tree/tree.component';
import { IconModule } from '../icon/icon.module';
import { iosArrowDownIcon } from '../../../internal/constants/icons/ios-arrow-down-icon.const';
import { iosArrowForwardIcon } from '../../../internal/constants/icons/ios-arrow-forward-icon.const';

@NgModule({
  declarations: [TreeComponent],
  imports: [
    SharedModule,
    SkeletonModule,
    SpinnerModule,
    ScrollingModule,
    CdkTreeModule,
    IconModule.forFeature([iosArrowDownIcon, iosArrowForwardIcon])
  ],
  exports: [TreeComponent]
})
export class TreeModule {}
