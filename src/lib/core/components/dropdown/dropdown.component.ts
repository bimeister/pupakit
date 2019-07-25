import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { isNullOrUndefined } from '../../../helpers/is-null-or-undefined.helper';

export interface IconData {
  name?: string;
  src?: string;
  color?: string;
}

export interface DropdownItem<T> {
  caption: string;
  iconLeft?: IconData;
  iconRight?: IconData;
  data: T;
}

@Component({
  selector: 'pupa-dropdown',
  styleUrls: ['./dropdown.component.scss'],
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent<T> implements AfterViewInit, OnDestroy {
  private readonly sub: Subscription = new Subscription();
  @ViewChild('dropdown', { static: true }) public dropdownRef: ElementRef<HTMLDivElement>;
  public get dropdown(): HTMLDivElement {
    return this.dropdownRef.nativeElement;
  }
  @Input() public items: DropdownItem<T>[];
  @Input() public anchor: HTMLElement;
  @Input() public positionChange$: Observable<void>;
  @Output() public select: EventEmitter<T> = new EventEmitter<T>();

  private isMouseDown: boolean;

  public topPx: number = 0;
  public leftPx: number = 0;
  public widthPx: number = 0;
  private readonly offsetTopPx: number = 4;

  public open: boolean = false;

  constructor(private readonly cDRef: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    if (!this.anchor) {
      return;
    }
    this.anchor.addEventListener('click', this.onClick);
    if (this.positionChange$) {
      this.sub.add(this.positionChange$.subscribe(this.checkPosition));
    }
    this.checkPosition();
  }

  public ngOnDestroy(): void {
    if (!this.anchor) {
      return;
    }
    this.anchor.removeEventListener('click', this.onClick);
    this.sub.unsubscribe();
  }

  public onClick: () => void = () => this.toggle(true);

  public toggle: (value?: boolean) => void = (value?: boolean): void => {
    this.open = isNullOrUndefined(value) ? !this.open : value;
    this.cDRef.markForCheck();
  };

  @HostListener('window:mousedown')
  public onMouseDown(): void {
    this.isMouseDown = true;
  }

  @HostListener('window:mouseup')
  public onMouseUp(): void {
    this.isMouseDown = false;
  }

  @HostListener('window:mousemove')
  public onMouseMove(): void {
    if (!this.isMouseDown) {
      return;
    }
    this.checkPosition();
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  public readonly checkPosition: () => void = (): void => {
    if (!this.anchor || !this.dropdown) {
      return;
    }
    const box: ClientRect = this.anchor.getBoundingClientRect();
    const dropDownBottom: number = box.top + box.height + this.offsetTopPx + this.dropdown.clientHeight;
    this.topPx =
      dropDownBottom < window.innerHeight
        ? (this.topPx = box.top + box.height + this.offsetTopPx)
        : (this.topPx = box.top + box.height - this.dropdown.clientHeight);

    this.leftPx = box.left;
    this.widthPx = box.width;
    this.cDRef.markForCheck();
  };

  @HostListener('document:click', ['$event'])
  public clickOutsideCheck(event: MouseEvent): void {
    if (!this.anchor || !this.dropdownRef.nativeElement) {
      return;
    }
    const clickedInside: boolean =
      this.anchor.contains(event.target as Node) || this.dropdownRef.nativeElement.contains(event.target as Node);
    if (!clickedInside) {
      this.toggle(false);
    }
  }

  public onSelect(item: DropdownItem<T>): void {
    this.select.emit(item.data);
    this.toggle(false);
  }
}
