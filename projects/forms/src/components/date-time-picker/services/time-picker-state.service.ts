import { Injectable } from '@angular/core';

const HOURS: number[] = Array(24)
  .fill(0)
  .map((_hour: number, index: number) => index);
const MINUTES: number[] = Array(60)
  .fill(0)
  .map((_hour: number, index: number) => index);
const SECONDS: number[] = MINUTES;

const ITEM_SIZE_PX: number = 28;

@Injectable({ providedIn: 'any' })
export class TimePickerStateService {
  public readonly hours: number[] = HOURS;
  public readonly minutes: number[] = MINUTES;
  public readonly seconds: number[] = SECONDS;

  public readonly itemSizePx: number = ITEM_SIZE_PX;
}
