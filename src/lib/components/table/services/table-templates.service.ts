import { Injectable, TemplateRef } from '@angular/core';
import { TableHeaderCellContext } from '../../../../internal/declarations/interfaces/table-header-cell-context.interface';
import { TableBodyCellContext } from '../../../../internal/declarations/interfaces/table-body-cell-context.interface';
import { isNil, Nullable } from '@bimeister/utilities';

interface ColumnTemplates<T> {
  headerCell: Nullable<TemplateRef<TableHeaderCellContext>>;
  bodyCell: Nullable<TemplateRef<TableBodyCellContext<T>>>;
}

const HEADER_DEFAULT_TEMPLATES_ERROR_TEXT: string = '[TableTemplatesService] default template in null for header cell';
const BODY_DEFAULT_TEMPLATES_ERROR_TEXT: string = '[TableTemplatesService] default template is null for body cell';

@Injectable()
export class TableTemplatesService<T> {
  private defaultTemplates: Nullable<ColumnTemplates<T>> = null;
  private readonly columnIdToTemplatesMap: Map<string, ColumnTemplates<T>> = new Map<string, ColumnTemplates<T>>();

  public registerDefaultTemplates(templates: ColumnTemplates<T>): void {
    this.defaultTemplates = templates;
  }

  public registerTemplates(columnType: string, templates: ColumnTemplates<T>): void {
    this.columnIdToTemplatesMap.set(columnType, templates);
  }

  public getHeaderCellTemplateByType(columnType: string): TemplateRef<TableHeaderCellContext> {
    if (isNil(this.defaultTemplates)) {
      throw new Error(HEADER_DEFAULT_TEMPLATES_ERROR_TEXT);
    }
    return this.columnIdToTemplatesMap.get(columnType)?.headerCell ?? this.defaultTemplates.headerCell;
  }

  public getBodyCellTemplateByType(columnType: string): TemplateRef<TableBodyCellContext<T>> {
    if (isNil(this.defaultTemplates)) {
      throw new Error(BODY_DEFAULT_TEMPLATES_ERROR_TEXT);
    }
    return this.columnIdToTemplatesMap.get(columnType)?.bodyCell ?? this.defaultTemplates.bodyCell;
  }
}
