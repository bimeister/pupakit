import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';

import { TreeNewComponent } from './components/tree-new/tree-new.component';
import { TreeItemTemplateDirective } from './directives/tree-item-template.directive';
import { PupaIconsModule, iosArrowDownIcon, iosArrowForwardIcon } from '@bimeister/pupakit.icons';
import { PupaIconModule, PupaScrollableModule, PupaSkeletonModule, PupaSpinnerModule } from '@bimeister/pupakit.kit';
import { CommonModule } from '@angular/common';
import { PupaTreeLayoutModule } from '../tree-layout/tree-layout.module';

@NgModule({
  declarations: [TreeNewComponent, TreeItemTemplateDirective],
  imports: [
    CommonModule,
    PupaSkeletonModule,
    PupaSpinnerModule,
    ScrollingModule,
    CdkTreeModule,
    PupaIconModule,
    PupaIconsModule.forFeature([iosArrowDownIcon, iosArrowForwardIcon]),
    PupaTreeLayoutModule,
    PupaScrollableModule,
  ],
  providers: [],
  exports: [TreeNewComponent, TreeItemTemplateDirective],
})
export class PupaTreeNewModule {}
