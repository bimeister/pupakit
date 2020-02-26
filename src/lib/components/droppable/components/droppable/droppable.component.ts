import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { DroppableHorizontalPosition } from '../../../../../internal/declarations/types/droppable-horizontal-position.type';
import { EventUnlistener } from '../../../../../internal/declarations/types/event-unlistener.type';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

const OFFSET_TOP_PX: number = 4;

@Component({
  selector: 'pupa-droppable',
  templateUrl: './droppable.component.html',
  styleUrls: ['./droppable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DroppableComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dropdown', { static: false }) public dropdownRef: ElementRef<HTMLDivElement>;
  public get dropdown(): HTMLDivElement | null {
    return this.dropdownRef && this.dropdownRef.nativeElement ? this.dropdownRef.nativeElement : null;
  }

  @Input() public anchor: HTMLElement;
  @Input() public positionChange$: Observable<void>;
  @Input() public horizontalPosition: DroppableHorizontalPosition = 'left';
  @Input() public maxWidth: number = null;
  @Input() public set open(value: boolean) {
    this._open = value;
    globalThis.requestAnimationFrame(() => {
      this.shown = value;
      this.checkPosition();
    });
  }
  public get open(): boolean {
    return this._open;
  }

  public shown: boolean = false;
  public topPx: number = 0;
  public leftPx: number = 0;

  private readonly subscription: Subscription = new Subscription();
  private anchorOnClickHandlerUnlistener: EventUnlistener;
  private _open: boolean = false;
  private anchorClientRect: ClientRect;
  private dropdownClientRect: ClientRect;

  constructor(protected readonly changeDetectorRef: ChangeDetectorRef, protected readonly renderer: Renderer2) {}

  public ngAfterViewInit(): void {
    if (isNullOrUndefined(this.anchor)) {
      return;
    }

    this.anchorOnClickHandlerUnlistener = this.renderer.listen(this.anchor, 'click', this.anchorOnClickHandler);

    if (this.positionChange$) {
      this.subscription.add(this.positionChange$.subscribe(() => globalThis.requestAnimationFrame(this.checkPosition)));
    }
    this.checkPosition();
  }

  public ngOnDestroy(): void {
    if (isNullOrUndefined(this.anchor)) {
      return;
    }
    this.anchorOnClickHandlerUnlistener();
    this.subscription.unsubscribe();
  }

  public anchorOnClickHandler = (): void => {
    this.toggle(true);
  };

  public toggle(value?: boolean): void {
    this.open = isNullOrUndefined(value) ? !this.open : value;
    this.changeDetectorRef.markForCheck();
    this.checkPosition();
  }

  @HostListener('window:resize')
  @HostListener('window:wheel')
  public close(): void {
    if (!this.open) {
      return;
    }
    this.toggle(false);
  }

  @HostListener('document:mouseup', ['$event'])
  public clickOutsideCheck(event: MouseEvent): void {
    if (isNullOrUndefined(this.anchor) || isNullOrUndefined(this.dropdown)) {
      return;
    }

    const clickedInside: boolean =
      this.anchor.contains(event.target as Node) || this.dropdownRef.nativeElement.contains(event.target as Node);

    if (!clickedInside) {
      this.toggle(false);
    }
  }

  public readonly checkPosition = (): void => {
    if (!this.anchor || !this.dropdown) {
      return;
    }

    this.anchorClientRect = this.anchor.getBoundingClientRect();
    this.dropdownClientRect = this.dropdown.getBoundingClientRect();

    this.setMaxWidth();
    this.setTopPx();
    this.setLeftPx();

    this.changeDetectorRef.markForCheck();
  };

  private setMaxWidth(): void {
    if (this.maxWidth) {
      this.renderer.setStyle(this.dropdown, 'maxWidth', `${this.maxWidth}px`);
      return;
    }

    this.renderer.setStyle(this.dropdown, 'width', `${this.anchorClientRect.width}px`);
  }

  private setTopPx(): void {
    const dropDownBottom: number =
      this.anchorClientRect.top + this.anchorClientRect.height + OFFSET_TOP_PX + this.dropdownClientRect.height;

    this.topPx = dropDownBottom < window.innerHeight ? this.getTopVerticalPosition() : this.getBottomVerticalPosition();
  }

  private setLeftPx(): void {
    const dropDownRight: number =
      this.anchorClientRect.left + this.anchorClientRect.width + this.dropdownClientRect.width;

    switch (this.horizontalPosition) {
      case 'right':
        this.leftPx = this.getRightHorisontalPosition();
        break;
      case 'left':
      default:
        this.leftPx =
          dropDownRight < window.innerWidth ? this.getLeftHorisontalPosition() : this.getRightHorisontalPosition();
    }
  }

  private getTopVerticalPosition(): number {
    return this.anchorClientRect.top + this.anchorClientRect.height + OFFSET_TOP_PX;
  }

  private getBottomVerticalPosition(): number {
    return this.anchorClientRect.top + this.anchorClientRect.height - this.dropdownClientRect.height;
  }

  private getRightHorisontalPosition(): number {
    return this.anchorClientRect.left + this.anchorClientRect.width - this.dropdown.offsetWidth;
  }

  private getLeftHorisontalPosition(): number {
    return this.anchorClientRect.left;
  }
}
