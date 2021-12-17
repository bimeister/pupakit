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
import { filterNotNil, filterTruthy, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { TableColumnSorting } from '../../../../../internal/declarations/enums/table-column-sorting.enum';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { TableColumnRef } from '../../../../../internal/declarations/interfaces/table-column-ref.interface';

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

  @Input() public resizable: boolean = false;
  @Input() public sortable: boolean = false;

  @Input() public isSortingNoneAvailable: boolean = true;
  private readonly isSortingNoneAvailable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private readonly sorting$: Observable<TableColumnSorting> = this.column$.pipe(
    filterNotNil(),
    switchMap((column: TableColumnRef) => column.sorting$)
  );

  public readonly isIconVisible$: Observable<boolean> = this.sorting$.pipe(
    map((sorting: TableColumnSorting) => sorting !== TableColumnSorting.None)
  );

  public readonly iconName$: Observable<string> = this.sorting$.pipe(
    map((sorting: TableColumnSorting) =>
      sorting === TableColumnSorting.Asc ? 'app-arrow-full-bot' : 'app-arrow-full-top'
    )
  );

  public readonly isResizing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private lastDeltaPx: number = 0;

  constructor(@Inject(DOCUMENT) private readonly document: Document, private readonly renderer: Renderer2) {
    this.subscription.add(this.processSortingParametersChanges());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processColumnChanges(changes?.column);
    this.processIsSortingNoneAvailableChanges(changes?.isSortingNoneAvailable);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public processClick(): void {
    if (!this.sortable) {
      return;
    }
    this.toggleSorting();
  }

  public processPress(): void {
    this.processPanStart();
  }

  public processPanStart(): void {
    this.isResizing$.next(true);
    this.renderer.setStyle(this.document.body, 'cursor', 'col-resize', RendererStyleFlags2.Important);
  }

  public processPan(event: HammerInput): void {
    const deltaPx: number = event.deltaX - this.lastDeltaPx;
    this.column$
      .pipe(
        take(1),
        switchMap((column: TableColumnRef) => column.updateWidthByDeltaPx(deltaPx)),
        filterTruthy()
      )
      .subscribe(() => {
        this.lastDeltaPx = event.deltaX;
      });
  }

  public processPanEnd(): void {
    this.isResizing$.next(false);
    this.lastDeltaPx = 0;
    this.renderer.setStyle(this.document.body, 'cursor', null);
  }

  public processPressup(): void {
    this.processPanEnd();
  }

  private toggleSorting(): void {
    this.column$
      .pipe(filterNotNil(), take(1))
      .subscribe((column: TableColumnRef) => column.toggleSorting(this.isSortingNoneAvailable));
  }

  private processColumnChanges(change: Nullable<ComponentChange<this, TableColumnRef>>): void {
    const value: Nullable<TableColumnRef> = change?.currentValue;

    if (isNil(value)) {
      return;
    }

    this.column$.next(value);
  }

  private processIsSortingNoneAvailableChanges(change: Nullable<ComponentChange<this, boolean>>): void {
    const value: Nullable<boolean> = change?.currentValue;

    if (isNil(value)) {
      return;
    }

    this.isSortingNoneAvailable$.next(value);
  }

  private processSortingParametersChanges(): Subscription {
    return combineLatest([this.sorting$, this.isSortingNoneAvailable$])
      .pipe(withLatestFrom(this.column$))
      .subscribe(([[sorting, isSortingNoneAvailable], column]: [[TableColumnSorting, boolean], TableColumnRef]) => {
        if (isSortingNoneAvailable) {
          return;
        }

        if (sorting !== TableColumnSorting.None) {
          return;
        }

        column.setSorting(TableColumnSorting.Asc);
      });
  }
}
