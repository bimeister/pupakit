import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { TableComponent } from './components/system/table/table.component';
import { TableColumnTemplateComponent } from './components/system/table-column-template/table-column-template.component';
import { TableHeaderCellTemplateDirective } from './directives/table-header-cell-template.directive';
import { TableBodyCellTemplateDirective } from './directives/table-cell-template.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TableHeaderCellComponent } from './components/external-predefined/table-header-cell/table-header-cell.component';
import { TableBodyCellComponent } from './components/external-predefined/table-body-cell/table-body-cell.component';
import { TableBodyCellContainerComponent } from './components/system/table-body-cell-container/table-body-cell-container.component';
import { TableHeaderCellContainerComponent } from './components/system/table-header-cell-container/table-header-cell-container.component';
import { TableBodyRowContainerComponent } from './components/system/table-body-row-container/table-body-row-container.component';
import { TableHeaderRowContainerComponent } from './components/system/table-header-row-container/table-header-row-container.component';
import { TablePlaceholderRowContainerComponent } from './components/system/table-placeholder-row-container/table-placeholder-row-container.component';
import { SkeletonModule } from '../skeleton/skeleton.module';
import { IconModule } from '../icon/icon.module';
import { appArrowFullTopIcon } from '../../../internal/constants/icons/app-arrow-full-top-icon.const';
import { appArrowFullBotIcon } from '../../../internal/constants/icons/app-arrow-full-bot-icon.const';
import { TableSkeletonComponent } from './components/external-predefined/table-skeleton/table-skeleton.component';
import { ScrollableModule } from '../scrollable/scrollable.module';

const INTERNAL_COMPONENTS: Type<unknown>[] = [
  TableBodyCellContainerComponent,
  TableHeaderCellContainerComponent,
  TableBodyRowContainerComponent,
  TableHeaderRowContainerComponent,
  TablePlaceholderRowContainerComponent,
];

const EXTERNAL_COMPONENTS: Type<unknown>[] = [
  TableComponent,
  TableColumnTemplateComponent,
  TableHeaderCellComponent,
  TableBodyCellComponent,
  TableSkeletonComponent,
];

const EXTERNAL_DIRECTIVES: Type<unknown>[] = [TableHeaderCellTemplateDirective, TableBodyCellTemplateDirective];

const IMPORTS: (Type<unknown> | ModuleWithProviders<unknown>)[] = [
  SharedModule,
  ScrollingModule,
  SkeletonModule,
  ScrollableModule,
  IconModule.forFeature([appArrowFullTopIcon, appArrowFullBotIcon]),
];

@NgModule({
  declarations: [...INTERNAL_COMPONENTS, ...EXTERNAL_COMPONENTS, ...EXTERNAL_DIRECTIVES],
  imports: IMPORTS,
  exports: [...EXTERNAL_COMPONENTS, ...EXTERNAL_DIRECTIVES],
})
export class TableModule {}
