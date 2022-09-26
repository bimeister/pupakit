import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { ActionsComponent } from './components/actions.component';
import { PupaActionTemplateDirective } from './directives/action-template.directive';
import { PupaActionDropdownTemplateDirective } from './directives/action-dropdown-template.directive';
import { PupaActionMoreTriggerTemplateDirective } from './directives/action-more-trigger-template.directive';
import { DropdownMenuModule } from '../dropdown-menu/dropdown-menu.module';
import { DropdownModule } from '../dropdown/dropdown.module';
import { ButtonsModule } from '../buttons/buttons.module';

const DECLARATIONS: Type<unknown>[] = [
  ActionsComponent,
  PupaActionTemplateDirective,
  PupaActionDropdownTemplateDirective,
  PupaActionMoreTriggerTemplateDirective,
];

@NgModule({
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
  imports: [CommonModule, ButtonsModule, DropdownModule, DropdownMenuModule, ScrollingModule],
})
export class ActionsModule {}
