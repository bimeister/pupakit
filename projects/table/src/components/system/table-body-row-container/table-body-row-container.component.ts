import { ChangeDetectionStrategy, Component, Input, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { TableColumn } from '../../../declarations/classes/table-column.class';
import { TableBodyRow } from '../../../declarations/classes/table-body-row.class';
import { TableScrollbarsService } from '../../../services/table-scrollbars.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableRowType } from '../../../declarations/enums/table-row-type.enum';
import { TableAdaptiveColumnsService } from '../../../services/table-adaptive-columns.service';

@Component({
  selector: 'pupa-table-body-row-container',
  templateUrl: './table-body-row-container.component.html',
  styleUrls: ['./table-body-row-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableBodyRowContainerComponent<T> {
  @Input() public columns: TableColumn[];
  @Input() public row: TableBodyRow<T>;

  public readonly rowType: TableRowType = TableRowType.Body;

  public readonly isPlaceholderVisible$: Observable<boolean> = combineLatest([
    this.tableScrollbarsService.isHorizontalVisible$,
    this.tableAdaptiveColumnsService.hasAdaptiveColumns$,
  ]).pipe(
    map(([isHorizontalVisible, hasAdaptiveColumns]: [boolean, boolean]) => !isHorizontalVisible && !hasAdaptiveColumns)
  );

  constructor(
    private readonly tableScrollbarsService: TableScrollbarsService,
    private readonly tableAdaptiveColumnsService: TableAdaptiveColumnsService
  ) {}

  public trackByFunction: TrackByFunction<TableColumn> = (index: number, _column: TableColumn) => index;
}
