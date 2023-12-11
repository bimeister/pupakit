import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  TemplateRef,
  Input,
  OnChanges,
  ViewContainerRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { TableTemplatesService } from '../../../services/table-templates.service';
import { isNil, Nullable } from '@bimeister/utilities';
import { TableColumn } from '../../../declarations/classes/table-column.class';
import { TableBodyCellContext } from '../../../declarations/interfaces/table-body-cell-context.interface';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { TableBodyRowRef } from '../../../declarations/interfaces/table-body-row-ref.interface';
import { isTableRowTreeEntity } from '../../../declarations/type-guards/is-table-row-tree-entity.type-guard';

@Component({
  selector: 'pupa-table-body-cell-container',
  templateUrl: './table-body-cell-container.component.html',
  styleUrls: ['./table-body-cell-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableBodyCellContainerComponent<T> implements OnChanges, AfterViewChecked {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) public viewContainerRef?: Nullable<ViewContainerRef>;

  @Input() public column: TableColumn;
  @Input() public row: TableBodyRowRef<T>;

  private lastRowValue: Nullable<TableBodyRowRef<T>> = null;
  private lastColumnValue: Nullable<TableColumn> = null;

  public templateRef: TemplateRef<TableBodyCellContext<T>>;
  public templateContext: TableBodyCellContext<T> = {
    $implicit: null,
    column: null,
  };

  constructor(private readonly tableTemplatesService: TableTemplatesService<T>) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processColumnChanges(changes?.column);
    this.processRowChanges(changes?.row);
  }

  public ngAfterViewChecked(): void {
    this.rerenderIfOptionIsTrue();
  }

  public hasExpander(): boolean {
    return isTableRowTreeEntity(this.row) && this.row.isExtendable && this.column.index === 0;
  }

  private processColumnChanges(change: Nullable<ComponentChange<this, TableColumn>>): void {
    const value: Nullable<TableColumn> = change?.currentValue;
    if (isNil(value)) {
      return;
    }
    this.templateRef = this.tableTemplatesService.getBodyCellTemplateByType(value.definition.type);
    this.templateContext = {
      ...this.templateContext,
      column: value,
    };
  }

  private processRowChanges(change: Nullable<ComponentChange<this, TableBodyRowRef<T>>>): void {
    const value: Nullable<TableBodyRowRef<T>> = change?.currentValue;
    if (isNil(value)) {
      return;
    }
    this.templateContext = {
      ...this.templateContext,
      $implicit: value,
    };
  }

  private rerenderIfOptionIsTrue(): void {
    const isDataChanged: boolean =
      this.lastRowValue?.id !== this.row.id || this.lastColumnValue?.definition?.id !== this.column.definition.id;

    if (!isDataChanged) {
      return;
    }

    this.lastRowValue = this.row;
    this.lastColumnValue = this.column;

    const isRerenderOptionActive: boolean = this.column.definition.rerenderOnRowOrColumnChanges;

    if (!isRerenderOptionActive) {
      return;
    }

    this.rerender();
  }

  private rerender(): void {
    this.viewContainerRef?.clear();
    this.viewContainerRef?.createEmbeddedView(this.templateRef, this.templateContext);
  }
}
