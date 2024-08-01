import { Injectable } from '@angular/core';
import { ClientUiStateHandlerService } from '@bimeister/pupakit.common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const HOURS: number[] = Array(24)
  .fill(0)
  .map((_hour: number, index: number) => index);
const MINUTES: number[] = Array(60)
  .fill(0)
  .map((_hour: number, index: number) => index);
const SECONDS: number[] = MINUTES;

const ITEM_SIZE_REM: number = 7;

@Injectable({ providedIn: 'any' })
export class TimePickerStateService {
  public readonly hours: number[] = HOURS;
  public readonly minutes: number[] = MINUTES;
  public readonly seconds: number[] = SECONDS;

  public readonly itemSizePx$: Observable<number> = this.clientUiStateHandlerService.remSizePx$.pipe(
    map((remSizePx: number) => remSizePx * ITEM_SIZE_REM)
  );

  constructor(private readonly clientUiStateHandlerService: ClientUiStateHandlerService) {}
}
