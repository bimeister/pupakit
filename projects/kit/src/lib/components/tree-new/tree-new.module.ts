import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';

import { SkeletonModule } from '../skeleton/skeleton.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { SharedModule } from '../../../internal/shared/shared.module';
import { TreeNewComponent } from './components/tree-new/tree-new.component';
import { IconModule } from '../icon/icon.module';
import { iosArrowDownIcon } from '../../../internal/constants/icons/ios-arrow-down-icon.const';
import { iosArrowForwardIcon } from '../../../internal/constants/icons/ios-arrow-forward-icon.const';
import { TreeItemTemplateDirective } from './directives/tree-item-template.directive';
import { TreeLayoutModule } from '../../components/tree-layout/tree-layout.module';
import { ScrollableModule } from '../../components/scrollable/scrollable.module';

@NgModule({
  declarations: [TreeNewComponent, TreeItemTemplateDirective],
  imports: [
    SharedModule,
    SkeletonModule,
    SpinnerModule,
    ScrollingModule,
    CdkTreeModule,
    IconModule.forFeature([iosArrowDownIcon, iosArrowForwardIcon]),
    TreeLayoutModule,
    ScrollableModule,
  ],
  providers: [],
  exports: [TreeNewComponent, TreeItemTemplateDirective],
})
export class TreeNewModule {}
