import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';
import { iosArrowDownIcon } from '../../../internal/constants/icons/ios-arrow-down-icon.const';
import { iosArrowForwardIcon } from '../../../internal/constants/icons/ios-arrow-forward-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { SkeletonModule } from '../skeleton/skeleton.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { HugeTreeComponent } from './components/huge-tree/huge-tree.component';
import { HugeTreeUsageDemoComponent } from './components/usage/huge-tree-usage-demo.component';

@NgModule({
  declarations: [HugeTreeComponent, HugeTreeUsageDemoComponent],
  imports: [
    SharedModule,
    SkeletonModule,
    SpinnerModule,
    ScrollingModule,
    CdkTreeModule,
    IconModule.forFeature([iosArrowDownIcon, iosArrowForwardIcon]),
  ],
  providers: [],
  exports: [HugeTreeComponent, HugeTreeUsageDemoComponent],
})
export class HugeTreeModule {}
