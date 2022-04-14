import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DayOfWeek } from '../types/day-of-week';
import { DaySelectionStateMap } from '../types/day-selection-state-map';

@Injectable()
export class DaySelectorStateService {
  private readonly daySelectionStateMap: DaySelectionStateMap = new Map<DayOfWeek, boolean>([
    ['mon', false],
    ['tue', false],
    ['wed', false],
    ['thu', false],
    ['fri', false],
    ['sat', false],
    ['sun', false],
  ]);

  private readonly daysWithSelectionStateChanged$: BehaviorSubject<DayOfWeek[]> = new BehaviorSubject<DayOfWeek[]>([]);

  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly daysOfWeek$: Observable<DaySelectionStateMap> = this.daysWithSelectionStateChanged$.pipe(
    tap((selectionChangedDays: DayOfWeek[]) => {
      selectionChangedDays.forEach((day: DayOfWeek) => {
        this.daySelectionStateMap.set(day, !this.daySelectionStateMap.get(day));
      });
    }),
    map(() => this.daySelectionStateMap)
  );

  public set disabled(isDisabled: boolean) {
    this.isDisabled$.next(isDisabled);
  }

  public changeDaysSelectionState(days: DayOfWeek[]): void {
    this.daysWithSelectionStateChanged$.next(days);
  }
}
