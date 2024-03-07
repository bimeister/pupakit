import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { PupaCommonModule } from '@bimeister/pupakit.common';
import {
  PupaButtonsModule,
  PupaDividerModule,
  PupaDropdownMenuModule,
  PupaDropdownModule,
} from '@bimeister/pupakit.kit';
import { ActionsComponent } from './components/actions.component';
import { PupaActionLeftSideContentTemplateDirective } from './directives/action-left-side-content-template.directive';
import { PupaActionMoreTriggerTemplateDirective } from './directives/action-more-trigger-template.directive';
import { PupaActionRightSideContentTemplateDirective } from './directives/action-right-side-content-template.directive';
import { PupaActionTemplateDirective } from './directives/action-template.directive';

const DECLARATIONS: Type<unknown>[] = [
  ActionsComponent,
  PupaActionTemplateDirective,
  PupaActionMoreTriggerTemplateDirective,
  PupaActionLeftSideContentTemplateDirective,
  PupaActionRightSideContentTemplateDirective,
];

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  imports: [
    CommonModule,
    PupaCommonModule,
    PupaButtonsModule,
    PupaDropdownModule,
    PupaDropdownMenuModule,
    PupaDividerModule,
    ScrollingModule,
  ],
})
export class PupaActionsModule {}
