import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ComponentChanges } from '@bimeister/pupakit.common';
import { isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TableColumnRef } from '../../../declarations/interfaces/table-column-ref.interface';
import { TableTreeDefinition } from '../../../declarations/interfaces/table-tree-definition.interface';
import { hasTreeDefinition } from '../../../declarations/type-guards/is-tree-definition.type-guard';
import { TableBodyRowRef } from '../../../declarations/interfaces/table-body-row-ref.interface';

@Component({
  selector: 'pupa-table-body-cell',
  templateUrl: './table-body-cell.component.html',
  styleUrls: ['./table-body-cell.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableBodyCellComponent implements OnChanges {
  @Input() public clickable: boolean = false;
  @Input() public column: Nullable<TableColumnRef>;
  @Input() public row: Nullable<TableBodyRowRef<unknown>>;

  private readonly column$: ReplaySubject<TableColumnRef> = new ReplaySubject<TableColumnRef>(null);
  private readonly row$: ReplaySubject<TableBodyRowRef<unknown>> = new ReplaySubject<TableBodyRowRef<unknown>>(null);

  public hasExpander$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isTreeRootCell$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public treeLevel$: BehaviorSubject<number> = new BehaviorSubject(0);
  public treeCellMarker$: BehaviorSubject<Nullable<string>> = new BehaviorSubject(null);

  public readonly isCurrentDraggable$: Observable<boolean> = this.column$.pipe(
    switchMap((column: TableColumnRef) => column.isCurrentDraggable$)
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) return;
    const column: Nullable<TableColumnRef> = changes.column?.currentValue;
    const row: Nullable<TableBodyRowRef<unknown>> = changes.row?.currentValue;
    this.processColumnChanges(column);
    this.processRowChanges(row);
    this.initTableTreeCell(row, column);
  }

  private processColumnChanges(value: Nullable<TableColumnRef>): void {
    if (isNil(value)) {
      return;
    }
    this.column$.next(value);
  }

  private processRowChanges(value: TableBodyRowRef<unknown>): void {
    if (isNil(value)) {
      return;
    }
    this.row$.next(value);
  }

  private initTableTreeCell(row: Nullable<TableBodyRowRef<unknown>>, column: Nullable<TableColumnRef>): void {
    const currentRow: TableBodyRowRef<unknown> = isNil(row) ? this.row : row;
    const rowData: unknown = currentRow.data;
    const currentColumn: TableColumnRef = isNil(column) ? this.column : column;
    const featureOptions: unknown = currentColumn.definition?.featureOptions;
    const isTreeDefinition: boolean = hasTreeDefinition(featureOptions);

    if (!isTreeDefinition) {
      return;
    }

    const { modelLevelKey, modelExpandableKey, modelExpandedKey, treeNodeMarker } =
      featureOptions as TableTreeDefinition;

    this.isTreeRootCell$.next(true);

    const treeLevel: number = rowData[modelLevelKey];
    const uiLevel: number = this.calculateTreePadding(treeLevel);
    this.treeLevel$.next(uiLevel);

    const isExpandable: boolean = rowData[modelExpandableKey];
    this.hasExpander$.next(isExpandable);

    let treeCellMarker: string;
    if (isExpandable) {
      treeCellMarker = Boolean(rowData[modelExpandedKey]) ? 'app-caret-down' : 'app-caret-right';
    } else {
      treeCellMarker = treeNodeMarker;
    }
    this.treeCellMarker$.next(treeCellMarker);
  }

  private calculateTreePadding(treeDataLevel: number): number {
    const multiplier: number = 3;
    return treeDataLevel === 0 ? 1 : treeDataLevel * multiplier + 1;
  }
}
