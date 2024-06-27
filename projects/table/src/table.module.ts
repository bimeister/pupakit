import { ScrollingModule } from '@angular/cdk/scrolling';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { appArrowFullBotIcon, appArrowFullTopIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { CommonModule } from '@angular/common';
import { PupaCommonModule } from '@bimeister/pupakit.common';
import { PupaScrollableModule, PupaSkeletonModule, PupaTooltipModule } from '@bimeister/pupakit.kit';
import { TableBodyCellComponent } from './components/external-predefined/table-body-cell/table-body-cell.component';
import { TableHeaderCellComponent } from './components/external-predefined/table-header-cell/table-header-cell.component';
import { TableSkeletonComponent } from './components/external-predefined/table-skeleton/table-skeleton.component';
import { TableBodyCellContainerComponent } from './components/system/table-body-cell-container/table-body-cell-container.component';
import { TableBodyRowContainerComponent } from './components/system/table-body-row-container/table-body-row-container.component';
import { TableColumnTemplateComponent } from './components/system/table-column-template/table-column-template.component';
import { TableHeaderCellContainerComponent } from './components/system/table-header-cell-container/table-header-cell-container.component';
import { TableHeaderRowContainerComponent } from './components/system/table-header-row-container/table-header-row-container.component';
import { TablePlaceholderRowContainerComponent } from './components/system/table-placeholder-row-container/table-placeholder-row-container.component';
import { TableComponent } from './components/system/table/table.component';
import { TableBodyCellTemplateDirective } from './directives/table-cell-template.directive';
import { TableHeaderCellTemplateDirective } from './directives/table-header-cell-template.directive';
import { PupaDndModule } from '@bimeister/pupakit.dnd';
import { SerializeTableBodyRowPipe } from './pipes/serialize-table-body-row.pipe';

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

const INTERNAL_PIPES: Type<unknown>[] = [SerializeTableBodyRowPipe];

const IMPORTS: (Type<unknown> | ModuleWithProviders<unknown>)[] = [
  CommonModule,
  ScrollingModule,
  PupaCommonModule,
  PupaScrollableModule,
  PupaSkeletonModule,
  PupaDndModule,
  PupaIconsModule.forFeature([appArrowFullTopIcon, appArrowFullBotIcon]),
  PupaTooltipModule,
];

@NgModule({
  declarations: [...INTERNAL_COMPONENTS, ...EXTERNAL_COMPONENTS, ...EXTERNAL_DIRECTIVES, INTERNAL_PIPES],
  imports: [IMPORTS],
  exports: [...EXTERNAL_COMPONENTS, ...EXTERNAL_DIRECTIVES],
})
export class PupaTableModule {}
