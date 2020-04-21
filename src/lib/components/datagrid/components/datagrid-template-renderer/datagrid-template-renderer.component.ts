import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export { ICellRendererParams };

@Component({
  selector: 'pupa-datagrid-template-renderer',
  templateUrl: './datagrid-template-renderer.component.html',
  styleUrls: ['./datagrid-template-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridTemplateRendererComponent implements ICellRendererAngularComp {
  public template: TemplateRef<HTMLElement>;
  public templateContext: { $implicit: unknown; params: ICellRendererParams };

  public refresh(params: ICellRendererParams): boolean {
    this.templateContext = {
      $implicit: params.value,
      params
    };
    return true;
  }

  public agInit(params: ICellRendererParams): void {
    this.template = params['templateRef'];
    this.refresh(params);
  }
}
