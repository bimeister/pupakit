import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { filterNotNil, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { TimePickerStateService } from '../../services/time-picker-state.service';

@Component({
  selector: 'pupa-time-picker-digits',
  templateUrl: './time-picker-digits.component.html',
  styleUrls: ['./time-picker-digits.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerDigitsComponent implements OnChanges, OnInit, OnDestroy, AfterContentInit {
  @Input() public digits: number[] = [];
  public readonly digits$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  @Input() public chosenDigit: number = null;

  public readonly itemSizePx$: Observable<number> = this.timePickerStateService.itemSizePx$;

  @ViewChild('viewPort', { static: true }) private readonly viewPort: CdkVirtualScrollViewport;
  private readonly viewPortReference$: ReplaySubject<CdkVirtualScrollViewport> = new ReplaySubject(1);

  @Output() private readonly selectedDigit: EventEmitter<number> = new EventEmitter<number>();

  private readonly scrolledIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly selectedDigit$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly timePickerStateService: TimePickerStateService) {}

  @HostListener('wheel', ['$event'])
  @HostListener('touchstart', ['$event'])
  public windowEventsHandler(event: Event): void {
    event.stopPropagation();
  }

  public ngOnInit(): void {
    this.subscription.add(this.handleViewPortScrolledIndexChanges()).add(this.handleChosenDigitChanges());
  }

  public ngAfterContentInit(): void {
    this.viewPortReference$.next(this.viewPort);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDigitsChange(changes?.digits);
    this.processChosenDigitChange(changes?.chosenDigit);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public readonly trackByItem: TrackByFunction<number> = (index: number, item: number): string => `${index}-${item}`;

  public selectDigit(digit: number, index: number): void {
    this.viewPort.scrollToIndex(index, 'smooth');
    this.selectedDigit$.next(digit);
    this.selectedDigit.emit(digit);
  }

  private processDigitsChange(change: ComponentChange<this, number[]>): void {
    const updatedValue: number[] | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.digits$.next([...updatedValue, ...updatedValue]);
    this.viewPort.scrollToIndex(updatedValue.length);
  }

  private processChosenDigitChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.selectedDigit$.next(updatedValue);
  }

  private handleChosenDigitChanges(): Subscription {
    return this.selectedDigit$
      .pipe(
        filterNotNil(),
        filter((digit: number) => digit > 0),
        debounceTime(300)
      )
      .subscribe((selectedIndex: number) => {
        const digitsSize: number = this.digits.length;
        const resultScrolledIndex: number = selectedIndex > digitsSize / 2 ? selectedIndex : digitsSize + selectedIndex;
        this.viewPort.scrollToIndex(resultScrolledIndex, 'smooth');
      });
  }

  /**
   * @description
   * Infinite loop scrolling function using virtual-scroll. Initially, the base array consists
   * of two default arrays. The selected item is the middle one. If we scroll down,
   * add array. As soon as the first array went out of visible area, then we remove it.
   * When we scroll up, the logic is similar.
   */
  private handleViewPortScrolledIndexChanges(): Subscription {
    return this.selectedDigit$
      .pipe(switchMap(() => this.viewPortReference$))
      .pipe(
        switchMap((viewPort: CdkVirtualScrollViewport) => viewPort.scrolledIndexChange),
        withLatestFrom(this.scrolledIndex$, this.itemSizePx$)
      )
      .subscribe(([scrolledIndex, prevScrolledIndex, itemSizePx]: [number, number, number]) => {
        const scrollDiff: number = Math.abs(scrolledIndex - prevScrolledIndex);

        this.scrolledIndex$.next(scrolledIndex);

        const viewPortSize: number = this.viewPort.getViewportSize();
        const offset: number = this.viewPort.measureScrollOffset();
        const total: number = this.digits.length;
        const scrollingOffset: number = total * itemSizePx + offset;

        const visibleItems: number = Math.ceil(viewPortSize / itemSizePx);

        const digitsBaseSize: number = total * 2;

        if (scrolledIndex === 0) {
          this.viewPort.scrollToOffset(scrollingOffset);
          return;
        }

        if (scrolledIndex + visibleItems === digitsBaseSize) {
          const newDigits: number[] = [...this.digits, ...this.digits, ...this.digits];
          this.digits$.next(newDigits);
          return;
        }

        const scrolledIndexInScrolledArea: boolean =
          scrolledIndex > digitsBaseSize && scrolledIndex - digitsBaseSize <= scrollDiff;

        if (scrolledIndex === digitsBaseSize || scrolledIndexInScrolledArea) {
          this.digits$.next([...this.digits, ...this.digits]);
          this.viewPort.scrollToIndex(total);
          return;
        }
      });
  }
}
