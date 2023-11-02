import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { appChevronDownIcon, appChevronRightIcon, appCircleIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaButtonsModule, PupaCheckboxModule, PupaSpinnerModule } from '@bimeister/pupakit.kit';
import { TreeNodeSkeletonComponent } from './components/tree-node-skeleton/tree-node-skeleton.component';
import { TreeNodeComponent } from './components/tree-node/tree-node.component';
import { TreeNodeActionsDirective } from './directives/tree-node-actions.directive';

@NgModule({
  declarations: [TreeNodeComponent, TreeNodeActionsDirective, TreeNodeSkeletonComponent],
  imports: [
    CdkTreeModule,
    CommonModule,
    PupaButtonsModule,
    PupaIconsModule.forFeature([appCircleIcon, appChevronDownIcon, appChevronRightIcon]),
    PupaCheckboxModule,
    PupaSpinnerModule,
  ],
  exports: [TreeNodeActionsDirective, TreeNodeComponent, TreeNodeSkeletonComponent],
})
export class PupaTreeLayoutModule {}
