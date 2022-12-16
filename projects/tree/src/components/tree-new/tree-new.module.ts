import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { iosArrowDownIcon, iosArrowForwardIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaScrollableModule, PupaSkeletonModule, PupaSpinnerModule } from '@bimeister/pupakit.kit';
import { PupaTreeLayoutModule } from '../tree-layout/tree-layout.module';
import { TreeNewComponent } from './components/tree-new/tree-new.component';
import { TreeItemTemplateDirective } from './directives/tree-item-template.directive';

@NgModule({
  declarations: [TreeNewComponent, TreeItemTemplateDirective],
  imports: [
    CommonModule,
    PupaSkeletonModule,
    PupaSpinnerModule,
    ScrollingModule,
    CdkTreeModule,
    PupaIconsModule.forFeature([iosArrowDownIcon, iosArrowForwardIcon]),
    PupaTreeLayoutModule,
    PupaScrollableModule,
  ],
  providers: [],
  exports: [TreeNewComponent, TreeItemTemplateDirective],
})
export class PupaTreeNewModule {}
