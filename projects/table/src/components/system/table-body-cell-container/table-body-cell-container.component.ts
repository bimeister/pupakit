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
import { TableBodyRow } from '../../../declarations/classes/table-body-row.class';
import { TableBodyCellContext } from '../../../declarations/interfaces/table-body-cell-context.interface';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';

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
  @Input() public row: TableBodyRow<T>;

  private lastRowValue: Nullable<TableBodyRow<T>> = null;
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

  private processRowChanges(change: Nullable<ComponentChange<this, TableBodyRow<T>>>): void {
    const value: Nullable<TableBodyRow<T>> = change?.currentValue;
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
