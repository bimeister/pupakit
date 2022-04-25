import { NgModule } from '@angular/core';
import { TreeNodeComponent } from './components/tree-node/tree-node.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../../lib/components/icon/icon.module';
import { ButtonModule } from '../../../lib/components/button/button.module';
import { TreeNodeActionsDirective } from './directives/tree-node-actions.directive';
import { appCircle } from '../../../internal/constants/icons/app-circle-icon.const';
import { appChevronRightIcon } from '../../../internal/constants/icons/app-chevron-right-icon.const';
import { appChevronDownIcon } from '../../../internal/constants/icons/app-chevron-down-icon.const';
import { CheckboxModule } from '../../../lib/components/checkbox/checkbox.module';
import { SpinnerModule } from '../../../lib/components/spinner/spinner.module';
import { TreeNodeSkeletonComponent } from './components/tree-node-skeleton/tree-node-skeleton.component';

@NgModule({
  declarations: [TreeNodeComponent, TreeNodeActionsDirective, TreeNodeSkeletonComponent],
  imports: [
    CdkTreeModule,
    CommonModule,
    IconModule,
    ButtonModule,
    IconModule.forFeature([appCircle, appChevronDownIcon, appChevronRightIcon]),
    CheckboxModule,
    SpinnerModule,
  ],
  exports: [TreeNodeActionsDirective, TreeNodeComponent, TreeNodeSkeletonComponent],
})
export class TreeLayoutModule {}
