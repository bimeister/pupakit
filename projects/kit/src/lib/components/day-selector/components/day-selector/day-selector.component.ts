import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { DaySelectorStateService } from '@kit/lib/components/day-selector/services/day-selector-state.service';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { isNil, Nullable } from '@bimeister/utilities';
import { LocaleDayFormatterService } from '@kit/lib/components/day-selector/services/locale-day-formatter.service';
import { DayOfWeek } from '@kit/lib/components/day-selector/types/day-of-week';
import { DaySelectorItem } from '@kit/lib/components/day-selector/types/day-selector-item';
import { DEFAULT_LOCALE } from '@kit/lib/components/day-selector/constants/default-locale.const';
import { DaySelectorSize } from '@kit/lib/components/day-selector/constants/day-selector-size.const';

@Component({
  selector: 'pupa-day-selector',
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DaySelectorStateService, LocaleDayFormatterService],
})
export class DaySelectorComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() public size: DaySelectorSize = 'medium';

  @Input() public set locale(value: string) {
    if (isNil(value) || value === '') this.localeDateFormatter.locale = DEFAULT_LOCALE;
    else this.localeDateFormatter.locale = value;
  }

  public readonly selectedDays$: Observable<DayOfWeek[]> = this.daySelectorState.selectedDays$;
  public readonly isDisabled$: Observable<boolean> = this.daySelectorState.isDisabled$;
  public readonly localeDaysOfWeek$: Observable<DaySelectorItem[]> = this.localeDateFormatter.localeDaysOfWeek$;

  private updateSelectedDays: Nullable<(days: DayOfWeek[]) => void> = null;
  private onTouched: Nullable<() => void> = null;

  private subscription: Subscription;

  constructor(
    private readonly daySelectorState: DaySelectorStateService,
    private readonly localeDateFormatter: LocaleDayFormatterService,
    private readonly cdr: ChangeDetectorRef,
    ngControl: NgControl
  ) {
    if (!isNil(ngControl)) ngControl.valueAccessor = this;
  }

  public ngOnInit(): void {
    this.subscription = this.handleSelectedChanges();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public isSelected(day: DayOfWeek): boolean {
    return this.daySelectorState.isSelected(day);
  }

  public changeDaySelectState(day: DayOfWeek): void {
    this.daySelectorState.changeDaySelectState(day);
  }

  public writeValue(days: DayOfWeek[] | string | null): void {
    if (isNil(days) || days === '') this.daySelectorState.setSelectedDays([]);
    else this.daySelectorState.setSelectedDays(days as DayOfWeek[]);
  }

  public registerOnChange(fn: (selectedDays: DayOfWeek[]) => void): void {
    this.updateSelectedDays = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.daySelectorState.setDisabled(isDisabled);
  }

  private handleSelectedChanges(): Subscription {
    return this.selectedDays$.subscribe((days: DayOfWeek[]) => {
      if (this.onTouched !== null) this.onTouched();

      if (this.updateSelectedDays !== null) this.updateSelectedDays(days);

      this.cdr.markForCheck();
    });
  }
}
