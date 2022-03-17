import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { TableColumnRef } from '../../../../../internal/declarations/interfaces/table-column-ref.interface';

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
  private readonly column$: ReplaySubject<TableColumnRef> = new ReplaySubject<TableColumnRef>(1);

  public readonly isCurrentDraggable$: Observable<boolean> = this.column$.pipe(
    switchMap((column: TableColumnRef) => column.isCurrentDraggable$)
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processColumnChanges(changes.column);
  }

  private processColumnChanges(change: Nullable<ComponentChange<this, TableColumnRef>>): void {
    const value: Nullable<TableColumnRef> = change?.currentValue;

    if (isNil(value)) {
      return;
    }

    this.column$.next(value);
  }
}
