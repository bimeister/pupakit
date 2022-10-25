import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { PupaButtonsModule, PupaDropdownMenuModule, PupaDropdownModule } from '@bimeister/pupakit.kit';
import { ActionsComponent } from './components/actions.component';
import { PupaActionDropdownTemplateDirective } from './directives/action-dropdown-template.directive';
import { PupaActionMoreTriggerTemplateDirective } from './directives/action-more-trigger-template.directive';
import { PupaActionTemplateDirective } from './directives/action-template.directive';

const DECLARATIONS: Type<unknown>[] = [
  ActionsComponent,
  PupaActionTemplateDirective,
  PupaActionDropdownTemplateDirective,
  PupaActionMoreTriggerTemplateDirective,
];

@NgModule({
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
  imports: [CommonModule, PupaButtonsModule, PupaDropdownModule, PupaDropdownMenuModule, ScrollingModule],
})
export class PupaActionsModule {}
