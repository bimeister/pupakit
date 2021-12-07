import { NgModule, Type } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appChevronRightIcon } from '../../../internal/constants/icons/app-chevron-right-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ButtonModule } from '../button/button.module';
import { DropdownMenuModule } from '../dropdown-menu/dropdown-menu.module';
import { IconModule } from '../icon/icon.module';
import { TooltipModule } from '../tooltip/tooltip.module';
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
    SharedModule,
    RouterModule,
    IconModule.forFeature([appChevronRightIcon]),
    ButtonModule,
    DropdownMenuModule,
    TooltipModule,
  ],
  exports: [...EXPORTS],
})
export class BreadcrumbsModule {}
