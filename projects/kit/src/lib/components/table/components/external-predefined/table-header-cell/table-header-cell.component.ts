import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  RendererStyleFlags2,
  ViewEncapsulation,
} from '@angular/core';
import { filterNotNil, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TableColumnSorting } from '../../../../../../internal/declarations/enums/table-column-sorting.enum';
import { TableColumnEvents } from '../../../../../../internal/declarations/events/table-column.events';
import { ComponentChange } from '../../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../../internal/declarations/interfaces/component-changes.interface';
import { TableColumnRef } from '../../../../../../internal/declarations/interfaces/table-column-ref.interface';
import { isTableColumnSortingOptions } from '../../../../../../internal/functions/type-guards/is-table-column-sorting-options.type-guard';

@Component({
  selector: 'pupa-table-header-cell',
  templateUrl: './table-header-cell.component.html',
  styleUrls: ['./table-header-cell.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderCellComponent implements OnChanges, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  @Input() public column: Nullable<TableColumnRef>;
  private readonly column$: BehaviorSubject<TableColumnRef> = new BehaviorSubject<TableColumnRef>(null);

  @Input() public isDndClone: boolean = false;

  public readonly isCurrentDraggable$: Observable<boolean> = this.column$.pipe(
    filterNotNil(),
    switchMap((column: TableColumnRef) => column.isCurrentDraggable$)
  );

  public readonly isSortable$: Observable<boolean> = this.column$.pipe(
    filterNotNil(),
    map((column: TableColumnRef) => {
      const featureOptions: unknown = column.definition.featureOptions;

      return isTableColumnSortingOptions(featureOptions) ? featureOptions.sortable : false;
    })
  );

  private readonly sorting$: Observable<TableColumnSorting> = this.column$.pipe(
    filterNotNil(),
    switchMap((column: TableColumnRef) =>
      merge(
        column.dispatchEvent(new TableColumnEvents.GetCurrentSorting(), TableColumnEvents.CurrentSortingResponse),
        column.listenEvent(TableColumnEvents.SortingChanged)
      )
    ),
    map((event: TableColumnEvents.CurrentSortingResponse | TableColumnEvents.SortingChanged) => event.sorting),
    shareReplayWithRefCount()
  );

  public readonly isIconVisible$: Observable<boolean> = this.sorting$.pipe(
    map((sorting: TableColumnSorting) => sorting !== TableColumnSorting.None)
  );

  public readonly iconName$: Observable<string> = this.sorting$.pipe(
    map((sorting: TableColumnSorting) =>
      sorting === TableColumnSorting.Asc ? 'app-arrow-full-bot' : 'app-arrow-full-top'
    )
  );

  constructor(@Inject(DOCUMENT) private readonly document: Document, private readonly renderer: Renderer2) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processColumnChanges(changes?.column);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public processPress(): void {
    this.processPanStart();
  }

  public processPanStart(): void {
    this.renderer.setStyle(this.document.body, 'cursor', 'col-resize', RendererStyleFlags2.Important);
  }

  public processPanEnd(): void {
    this.renderer.setStyle(this.document.body, 'cursor', null);
  }

  public processPressup(): void {
    this.processPanEnd();
  }

  private processColumnChanges(change: Nullable<ComponentChange<this, TableColumnRef>>): void {
    const value: Nullable<TableColumnRef> = change?.currentValue;

    if (isNil(value)) {
      return;
    }

    this.column$.next(value);
  }
}
