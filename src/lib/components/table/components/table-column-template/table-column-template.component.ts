import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  AfterContentInit,
  Input
} from '@angular/core';
import { TableHeaderCellTemplateDirective } from '../../directives/table-header-cell-template.directive';
import { TableBodyCellTemplateDirective } from '../../directives/table-cell-template.directive';
import { TableTemplatesService } from '../../services/table-templates.service';

@Component({
  selector: 'pupa-table-column-template',
  templateUrl: './table-column-template.component.html',
  styleUrls: ['./table-column-template.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableColumnTemplateComponent<T> implements AfterContentInit {
  @ContentChild(TableHeaderCellTemplateDirective) public tableHeaderCellTemplate: TableHeaderCellTemplateDirective;
  @ContentChild(TableBodyCellTemplateDirective) public tableBodyCellTemplate: TableBodyCellTemplateDirective<T>;

  @Input() public columnType: string;

  constructor(private readonly tableTemplatesService: TableTemplatesService<T>) {}

  public ngAfterContentInit(): void {
    this.tableTemplatesService.registerTemplates(this.columnType, {
      headerCell: this.tableHeaderCellTemplate?.templateRef,
      bodyCell: this.tableBodyCellTemplate?.templateRef
    });
  }
}
