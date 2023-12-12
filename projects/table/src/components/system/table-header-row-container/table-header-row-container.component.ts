import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TableColumn } from '../../../declarations/classes/table-column.class';
import { TableRow } from '../../../declarations/classes/table-row.class';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableScrollbarsService } from '../../../services/table-scrollbars.service';
import { TableRowType } from '../../../declarations/enums/table-row-type.enum';
import { TableAdaptiveColumnsService } from '../../../services/table-adaptive-columns.service';

@Component({
  selector: 'pupa-table-header-row-container',
  templateUrl: './table-header-row-container.component.html',
  styleUrls: ['./table-header-row-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderRowContainerComponent {
  @Input() public columns: TableColumn[];
  @Input() public row: TableRow;

  public readonly rowType: TableRowType = TableRowType.Header;

  public readonly isPlaceholderVisible$: Observable<boolean> = combineLatest([
    this.tableScrollbarsService.isHorizontalVisible$,
    this.tableAdaptiveColumnsService.isAdaptiveColumns$,
  ]).pipe(
    map(([isHorizontalVisible, isAdaptiveColumns]: [boolean, boolean]) => !isHorizontalVisible && !isAdaptiveColumns)
  );

  constructor(
    private readonly tableScrollbarsService: TableScrollbarsService,
    private readonly tableAdaptiveColumnsService: TableAdaptiveColumnsService
  ) {}
}
