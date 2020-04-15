import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  BodyScrollEvent,
  ColDef,
  GetRowNodeIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams
} from 'ag-grid-community';

import { DatagridManipulator } from '../../../../../internal/declarations/classes/datagrid-manipulator.class';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';
import { AgGridAngular } from 'ag-grid-angular';

export { ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, GetRowNodeIdFunc };

@Component({
  selector: 'pupa-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent<rowDataT> {
  public get themeClass(): string {
    return `pupagrid-theme-${this.manipulator.config.theme}`;
  }

  @Output() public rowClicked: EventEmitter<unknown> = new EventEmitter<unknown>();

  @Input() public manipulator: DatagridManipulator<rowDataT>;

  @ViewChild(AgGridAngular, { static: true, read: ElementRef })
  private readonly gridElement: ElementRef<HTMLElement>;

  private leftPinnedElements: HTMLElement[] = [];
  private isShadowOverlayApplied: boolean = false;
  private static readonly shadowOverlayClassName: string = 'ag-shadow-overlay';

  public constructor(private readonly renderer: Renderer2) {}

  @HostListener('window:resize')
  public processWindowResizeEvent(): void {
    this.manipulator.normalizeGrid();
  }

  public gridBodyScrolled(bodyScrollEvent: BodyScrollEvent): void {
    const shadowOverlayMustBeApplied: boolean = bodyScrollEvent.left > 0;
    if (this.isShadowOverlayApplied === shadowOverlayMustBeApplied) {
      return;
    }

    this.isShadowOverlayApplied = shadowOverlayMustBeApplied;
    this.leftPinnedElements.forEach(pinnedElement => {
      if (shadowOverlayMustBeApplied) {
        this.renderer.addClass(pinnedElement, DatagridComponent.shadowOverlayClassName);
      } else {
        this.renderer.removeClass(pinnedElement, DatagridComponent.shadowOverlayClassName);
      }
    });
  }

  public handleEvent(emitter: string, data: unknown): void {
    const eventEmitter: EventEmitter<unknown> = this[emitter];
    if (isNullOrUndefined(eventEmitter)) {
      return;
    }
    eventEmitter.emit(data);
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.manipulator.gridReady(gridReadyEvent.api);

    if (isNullOrUndefined(this.gridElement.nativeElement)) {
      return;
    }

    this.leftPinnedElements = [
      this.gridElement.nativeElement.querySelector('.ag-pinned-left-header'),
      this.gridElement.nativeElement.querySelector('.ag-pinned-left-cols-container')
    ];
  }
}
