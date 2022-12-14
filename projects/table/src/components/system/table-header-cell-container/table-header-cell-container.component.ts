import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { isNil, Nullable } from '@bimeister/utilities';
import { TableColumn } from '../../../declarations/classes/table-column.class';
import { TableRow } from '../../../declarations/classes/table-row.class';
import { TableHeaderCellContext } from '../../../declarations/interfaces/table-header-cell-context.interface';
import { TableColumnsIntersectionService } from '../../../services/table-columns-intersection.service';
import { TableTemplatesService } from '../../../services/table-templates.service';

@Component({
  selector: 'pupa-table-header-cell-container',
  templateUrl: './table-header-cell-container.component.html',
  styleUrls: ['./table-header-cell-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderCellContainerComponent<T> implements AfterViewInit, OnChanges, OnDestroy {
  @Input() public column: TableColumn;
  @Input() public row: TableRow;

  public templateRef: TemplateRef<TableHeaderCellContext>;
  public templateContext: TableHeaderCellContext = {
    $implicit: null,
    isDndClone: false,
  };

  constructor(
    private readonly tableTemplatesService: TableTemplatesService<T>,
    private readonly element: ElementRef<HTMLElement>,
    private readonly tableColumnsIntersectionService: TableColumnsIntersectionService
  ) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processColumnChanges(changes?.column);
  }

  public ngAfterViewInit(): void {
    this.tableColumnsIntersectionService.observe(this.element.nativeElement);
  }

  public ngOnDestroy(): void {
    this.tableColumnsIntersectionService.unobserve(this.element.nativeElement);
  }

  private processColumnChanges(change: Nullable<ComponentChange<this, TableColumn>>): void {
    const value: Nullable<TableColumn> = change?.currentValue;
    if (isNil(value)) {
      return;
    }

    this.templateRef = this.tableTemplatesService.getHeaderCellTemplateByType(value.definition.type);
    this.templateContext = {
      $implicit: value,
      isDndClone: false,
    };
  }
}
