import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DayOfWeek } from '@kit/lib/components/day-selector/types/day-of-week';

@Injectable()
export class DaySelectorStateService {
  private selectedDays: DayOfWeek[] = [];

  public readonly selectedDays$: BehaviorSubject<DayOfWeek[]> = new BehaviorSubject<DayOfWeek[]>(this.selectedDays);
  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public setSelectedDays(days: DayOfWeek[]): void {
    this.selectedDays = days;
    this.selectedDays$.next(this.selectedDays);
  }

  public setDisabled(isDisabled: boolean): void {
    this.isDisabled$.next(isDisabled);
  }

  public isSelected(day: DayOfWeek): boolean {
    return this.selectedDays.includes(day);
  }

  public changeDaySelectState(day: DayOfWeek): void {
    if (this.isSelected(day)) this.selectedDays.splice(this.selectedDays.indexOf(day), 1);
    else this.selectedDays.push(day);

    this.selectedDays$.next(this.selectedDays);
  }
}
