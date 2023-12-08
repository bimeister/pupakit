import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TableColumn } from '../../../declarations/classes/table-column.class';
import { TableRow } from '../../../declarations/classes/table-row.class';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableScrollbarsService } from '../../../services/table-scrollbars.service';
import { TableRowType } from '../../../declarations/enums/table-row-type.enum';
import { TableAdaptiveColumnsService } from '../../../services/table-adaptive-columns.service';

@Component({
  selector: 'pupa-table-placeholder-row-container',
  templateUrl: './table-placeholder-row-container.component.html',
  styleUrls: ['./table-placeholder-row-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePlaceholderRowContainerComponent {
  @Input() public columns: TableColumn[];
  @Input() public row: TableRow;
  @Input() public isFullHeightCells: boolean = false;
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
}
