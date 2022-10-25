import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appChevronRightIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaButtonsModule } from '../buttons/buttons.module';
import { PupaDropdownMenuModule } from '../dropdown-menu/dropdown-menu.module';
import { PupaDropdownModule } from '../dropdown/dropdown.module';
import { PupaIconModule } from '../icon/icon.module';
import { PupaTooltipModule } from '../tooltip/tooltip.module';
import { BreadcrumbSeparatorComponent } from './components/breadcrumb-separator/breadcrumb-separator.component';
import { BreadcrumbUnfitTriggerComponent } from './components/breadcrumb-unfit-trigger/breadcrumb-unfit-trigger.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { PupaBreadcrumbTemplateDirective } from './directives/breadcrumb-template.directive';

const COMPONENTS: Type<unknown>[] = [
  BreadcrumbsComponent,
  BreadcrumbComponent,
  BreadcrumbSeparatorComponent,
  BreadcrumbUnfitTriggerComponent,
];
const DIRECTIVES: Type<unknown>[] = [PupaBreadcrumbTemplateDirective];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS, ...DIRECTIVES];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
    CommonModule,
    RouterModule,
    PupaIconModule,
    PupaIconsModule.forFeature([appChevronRightIcon]),
    PupaButtonsModule,
    PupaDropdownModule,
    PupaDropdownMenuModule,
    PupaTooltipModule,
  ],
  exports: [...EXPORTS],
})
export class PupaBreadcrumbsModule {}
