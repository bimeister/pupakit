import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import { isNil } from '@bimeister/utilities/common';
import { ICellRendererAngularComp, IHeaderAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IHeaderParams } from 'ag-grid-community';

export { ICellRendererParams };

type Params = ICellRendererParams | IHeaderParams;

@Component({
  selector: 'pupa-datagrid-template-renderer',
  templateUrl: './datagrid-template-renderer.component.html',
  styleUrls: ['./datagrid-template-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridTemplateRendererComponent implements ICellRendererAngularComp, IHeaderAngularComp {
  public template: TemplateRef<HTMLElement>;
  public templateContext: { $implicit: unknown; params: Params };

  public refresh(params: Params): boolean {
    const implicitData: unknown = DatagridTemplateRendererComponent.isHeaderParams(params)
      ? params.displayName
      : params.value;

    this.templateContext = {
      $implicit: implicitData,
      params
    };

    return true;
  }

  public agInit(params: Params): void {
    this.template = params['templateRef'];
    this.refresh(params);
  }

  private static isHeaderParams(params: any): params is IHeaderParams {
    return !isNil(params.enableSorting);
  }
}
