import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { appChevronDownIcon, appChevronRightIcon, appCircleIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaButtonsModule, PupaCheckboxModule } from '@bimeister/pupakit.kit';
import { TreeNodeDescriptionComponent } from './components/tree-node-description/tree-node-description.component';
import { TreeNodeSkeletonComponent } from './components/tree-node-skeleton/tree-node-skeleton.component';
import { TreeNodeTitleComponent } from './components/tree-node-title/tree-node-title.component';
import { TreeNodeComponent } from './components/tree-node/tree-node.component';
import { TreeNodeActionsDirective } from './directives/tree-node-actions.directive';

@NgModule({
  declarations: [
    TreeNodeComponent,
    TreeNodeActionsDirective,
    TreeNodeSkeletonComponent,
    TreeNodeTitleComponent,
    TreeNodeDescriptionComponent,
  ],
  imports: [
    CdkTreeModule,
    CommonModule,
    PupaButtonsModule,
    PupaIconsModule.forFeature([appCircleIcon, appChevronDownIcon, appChevronRightIcon]),
    PupaCheckboxModule,
  ],
  exports: [
    TreeNodeActionsDirective,
    TreeNodeComponent,
    TreeNodeSkeletonComponent,
    TreeNodeTitleComponent,
    TreeNodeDescriptionComponent,
  ],
})
export class PupaTreeLayoutModule {}
