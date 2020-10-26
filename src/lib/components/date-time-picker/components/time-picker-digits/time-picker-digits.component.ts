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
  ViewEncapsulation
} from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { TimePickerStateService } from '../../services/time-picker-state.service';

@Component({
  selector: 'pupa-time-picker-digits',
  templateUrl: './time-picker-digits.component.html',
  styleUrls: ['./time-picker-digits.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerDigitsComponent implements OnChanges, OnInit, OnDestroy, AfterContentInit {
  @Input() public readonly digits: number[] = [];
  public readonly digits$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  public readonly itemSizePx: number = this.timePickerStateService.itemSizePx;

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
    this.subscription.add(this.handleViewPortScrolledIndexChanges());
  }

  public ngAfterContentInit(): void {
    this.viewPortReference$.next(this.viewPort);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processDigitsChange(changes?.digits);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public readonly trackByItem: TrackByFunction<number> = (index: number, item: number): string => {
    return `${index}-${item}`;
  };

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

  private handleViewPortScrolledIndexChanges(): Subscription {
    return this.viewPortReference$
      .pipe(
        switchMap((viewPort: CdkVirtualScrollViewport) => viewPort.scrolledIndexChange),
        withLatestFrom(this.scrolledIndex$)
      )
      .subscribe(([scrolledIndex, prevScrolledIndex]: [number, number]) => {
        const scrollDown: boolean = prevScrolledIndex <= scrolledIndex;
        const scrollDiff: number = Math.abs(scrolledIndex - prevScrolledIndex);
        this.scrolledIndex$.next(scrolledIndex);

        const viewPortSize: number = this.viewPort.getViewportSize();
        const offset: number = this.viewPort.measureScrollOffset();
        const total: number = this.digits.length;
        const scrollingOffset: number = total * this.itemSizePx + offset;

        const visibleItems: number = Math.ceil(viewPortSize / this.itemSizePx);

        const digitsBaseSize: number = total * 2;

        if (scrolledIndex === 0 && scrollDown) {
          this.viewPort.scrollToOffset(scrollingOffset);
          return;
        }

        if (scrolledIndex === 0 && !scrollDown) {
          this.viewPort.scrollToOffset(scrollingOffset);
          return;
        }

        if (scrolledIndex + visibleItems === digitsBaseSize) {
          const newDigits: number[] = [...this.digits, ...this.digits, ...this.digits];
          this.digits$.next(newDigits);
          return;
        }

        if (
          scrolledIndex === digitsBaseSize ||
          (scrolledIndex > digitsBaseSize && scrolledIndex - digitsBaseSize <= scrollDiff)
        ) {
          this.digits$.next([...this.digits, ...this.digits]);
          this.viewPort.scrollToIndex(total);
          return;
        }
      });
  }
}
