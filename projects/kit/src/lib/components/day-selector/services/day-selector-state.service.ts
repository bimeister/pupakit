import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DayOfWeek } from '../../../../internal/declarations/enums/day-of-week.enum';

@Injectable()
export class DaySelectorStateService {
  private readonly daySelectionStateMap: Map<DayOfWeek, boolean> = new Map<DayOfWeek, boolean>([
    [DayOfWeek.Monday, false],
    [DayOfWeek.Tuesday, false],
    [DayOfWeek.Wednesday, false],
    [DayOfWeek.Thursday, false],
    [DayOfWeek.Friday, false],
    [DayOfWeek.Saturday, false],
    [DayOfWeek.Sunday, false],
  ]);

  private readonly daysWithSelectionStateChanged$: BehaviorSubject<DayOfWeek[]> = new BehaviorSubject<DayOfWeek[]>([]);

  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly daysOfWeek$: Observable<Map<DayOfWeek, boolean>> = this.daysWithSelectionStateChanged$.pipe(
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
