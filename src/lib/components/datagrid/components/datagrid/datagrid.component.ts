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
import { isNil } from '@bimeister/utilities/commonjs/common';
import { AgGridAngular } from 'ag-grid-angular';
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
import { DatagridThemes } from '../../../../../internal/declarations/enums/datagrid-themes.enum';

export { ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, GetRowNodeIdFunc };

@Component({
  selector: 'pupa-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent<rowDataT> {
  public get themeClass(): string {
    if (this.manipulator.config.theme === DatagridThemes.None) {
      return '';
    }
    return `pupagrid ag-theme-balham pupagrid-theme-${this.manipulator.config.theme}`;
  }

  @Output() public rowClicked: EventEmitter<unknown> = new EventEmitter<unknown>();

  @Input() public manipulator: DatagridManipulator<rowDataT>;

  @Input()
  public suppressHorizontalScroll: boolean = false;

  @Input()
  public suppressRowDrag: boolean = false;

  @ViewChild(AgGridAngular, { static: true, read: ElementRef })
  private readonly gridElement: ElementRef<HTMLElement>;

  private leftPinnedElements: HTMLElement[] = [];
  private isShadowOverlayApplied: boolean = false;
  private static readonly shadowOverlayClassName: string = 'ag-shadow-overlay';

  constructor(private readonly renderer: Renderer2) {}

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
    if (isNil(eventEmitter)) {
      return;
    }
    eventEmitter.emit(data);
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.manipulator.gridReady(gridReadyEvent);

    if (isNil(this.gridElement.nativeElement)) {
      return;
    }

    this.leftPinnedElements = [
      this.gridElement.nativeElement.querySelector('.ag-pinned-left-header'),
      this.gridElement.nativeElement.querySelector('.ag-pinned-left-cols-container')
    ];

    /** {@link https://github.com/ag-grid/ag-grid/issues/2911|AgGrid issue} */
    if (this.manipulator.config.sizeColumnsToFit) {
      const centerViewport: Element = this.gridElement.nativeElement.querySelector('.ag-center-cols-viewport');
      this.renderer.setStyle(centerViewport, 'overflow-x', 'hidden');
    }
  }
}
