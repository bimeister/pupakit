import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { isNil } from '@bimeister/utilities';
import { isEmpty } from '@bimeister/utilities/common';
import { map, tap } from 'rxjs/operators';
import { DaySelectorStateService } from '../../services/day-selector-state.service';
import { LocaleDayFormatterService } from '../../services/locale-day-formatter.service';
import { DaySelectorSize } from '../../../../declarations/types/day-selector-size.type';
import { DaySelectorItem } from '../../../../declarations/interfaces/day-selector-item.interface';
import { OnChangeCallback } from '../../../../declarations/types/on-change-callback.type';
import { OnTouchedCallback } from '../../../../declarations/types/on-touched-callback.type';
import { DayOfWeek } from '../../../../declarations/enums/day-of-week.enum';

@Component({
  selector: 'pupa-day-selector',
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DaySelectorStateService, LocaleDayFormatterService],
})
export class DaySelectorComponent implements ControlValueAccessor {
  @Input() public size: DaySelectorSize = 'large';

  @Input() public set locale(value: string) {
    this.localeDateFormatter.locale = value;
  }

  public readonly isDisabled$: Observable<boolean> = this.daySelectorState.isDisabled$;
  public readonly selectorItems$: Observable<DaySelectorItem[]> = combineLatest([
    this.daySelectorState.daysOfWeek$,
    this.localeDateFormatter.localeNames$,
  ]).pipe(
    map(([daysOfWeek, localeNames]: [Map<DayOfWeek, boolean>, Record<DayOfWeek, string>]) => {
      const selectorItems: DaySelectorItem[] = [];
      daysOfWeek.forEach((isSelected: boolean, day: DayOfWeek) => {
        selectorItems.push({
          isSelected,
          key: day,
          localeName: localeNames[day],
        });
      });
      return selectorItems;
    }),
    tap(this.handleSelectedDaysChanged.bind(this))
  );

  private onChangeCallback: OnChangeCallback<DayOfWeek[]>;
  private onTouchedCallback: OnTouchedCallback;

  constructor(
    private readonly daySelectorState: DaySelectorStateService,
    private readonly localeDateFormatter: LocaleDayFormatterService,
    ngControl: NgControl
  ) {
    if (!isNil(ngControl)) {
      ngControl.valueAccessor = this;
    }
  }

  public changeDaySelectionState(day: DayOfWeek): void {
    this.daySelectorState.changeDaysSelectionState([day]);
  }

  public writeValue(days: DayOfWeek[]): void {
    this.daySelectorState.changeDaysSelectionState(isEmpty(days) ? [] : days);
  }

  public registerOnChange(onChangeCallback: OnChangeCallback<DayOfWeek[]>): void {
    this.onChangeCallback = onChangeCallback;
  }

  public registerOnTouched(onTouchedCallback: OnTouchedCallback): void {
    this.onTouchedCallback = onTouchedCallback;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.daySelectorState.disabled = isDisabled;
  }

  public trackByFunc(_: number, item: DaySelectorItem): DayOfWeek {
    return item.key;
  }

  private handleSelectedDaysChanged(selectorItems: DaySelectorItem[]): void {
    if (typeof this.onTouchedCallback === 'function') {
      this.onTouchedCallback();
    }

    if (typeof this.onChangeCallback === 'function') {
      const selectedDays: DayOfWeek[] = selectorItems
        .filter((item: DaySelectorItem) => item.isSelected)
        .map((item: DaySelectorItem) => item.key);

      this.onChangeCallback(selectedDays);
    }
  }
}
