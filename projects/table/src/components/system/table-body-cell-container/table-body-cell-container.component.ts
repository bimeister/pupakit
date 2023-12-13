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
import { ComponentChanges } from '@bimeister/pupakit.common';
import { TableBodyRowRef } from '../../../declarations/interfaces/table-body-row-ref.interface';
import { BehaviorSubject } from 'rxjs';

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

  public hasExpander$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isTreeRowRootCell$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public treeLevel$: BehaviorSubject<number> = new BehaviorSubject(0);
  public treeCellMarker$: BehaviorSubject<Nullable<string>> = new BehaviorSubject(null);

  constructor(private readonly tableTemplatesService: TableTemplatesService<T>) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) return;
    const column: Nullable<TableColumn> = changes.column?.currentValue;
    const row: Nullable<TableBodyRowRef<T>> = changes.row?.currentValue;
    this.processColumnChanges(column);
    this.processRowChanges(row);
    this.initTableTreeCell(row, column);
  }

  public ngAfterViewChecked(): void {
    this.rerenderIfOptionIsTrue();
  }

  private processColumnChanges(value: Nullable<TableColumn>): void {
    if (isNil(value)) {
      return;
    }
    this.templateRef = this.tableTemplatesService.getBodyCellTemplateByType(value.definition.type);
    this.templateContext = {
      ...this.templateContext,
      column: value,
    };
  }

  private processRowChanges(value: Nullable<TableBodyRowRef<T>>): void {
    if (isNil(value)) {
      return;
    }
    this.templateContext = {
      ...this.templateContext,
      $implicit: value,
    };
  }

  private initTableTreeCell(row: Nullable<TableBodyRowRef<T>>, column: Nullable<TableColumn>): void {
    const currentRow: TableBodyRowRef<T> = isNil(row) ? this.row : row;
    const currentColumn: TableColumn = isNil(column) ? this.column : column;

    if (currentColumn.index !== 0 || isNil(currentRow.treeDefinition)) {
      return;
    }

    const {
      data,
      treeDefinition: { modelLevelKey, modelExpandableKey, modelExpandedKey, treeNodeMarker },
    } = currentRow;

    this.isTreeRowRootCell$.next(true);

    const treeLevel: number = data[modelLevelKey];
    const uiLevel: number = this.calculateTreePadding(treeLevel);
    this.treeLevel$.next(uiLevel);

    const isExpandable: boolean = data[modelExpandableKey];
    this.hasExpander$.next(isExpandable);

    let treeCellMarker: string;
    if (isExpandable) {
      treeCellMarker = Boolean(data[modelExpandedKey]) ? 'app-caret-down' : 'app-caret-right';
    } else {
      treeCellMarker = treeNodeMarker;
    }
    this.treeCellMarker$.next(treeCellMarker);
  }

  private calculateTreePadding(treeLevel: number): number {
    const multiplier: number = 3;
    const uiLevel: number = treeLevel + 1;
    return uiLevel === 1 ? 1 : (uiLevel - 1) * multiplier + 1;
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
