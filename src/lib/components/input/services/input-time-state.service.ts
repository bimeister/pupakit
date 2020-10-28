import { Injectable } from '@angular/core';
import { isEmpty } from '@meistersoft/utilities';
import { TimeFormatPipe } from '../../../../internal/pipes/time-format.pipe';

@Injectable({ providedIn: 'any' })
export class InputTimeStateService {
  constructor(private readonly timeFormatPipe: TimeFormatPipe) {}

  public getUpdatedValueStringAfterSelectHours(hours: number, inputCurrentValue: string): string {
    const parsedHours: string = this.timeFormatPipe.transform(hours);

    if (isEmpty(inputCurrentValue) || inputCurrentValue.length < 3) {
      return `${parsedHours}`;
    }

    if (inputCurrentValue.length === 3) {
      return `${parsedHours}:`;
    }

    return `${parsedHours}${inputCurrentValue.slice(2)}`;
  }

  public getUpdatedValueStringAfterSelectMinutes(minutes: number, inputCurrentValue: string): string {
    const parsedMinutes: string = this.timeFormatPipe.transform(minutes);

    if (isEmpty(inputCurrentValue)) {
      return `00:${parsedMinutes}`;
    }

    if (inputCurrentValue.length === 1) {
      return `${inputCurrentValue}0:${parsedMinutes}`;
    }

    if (inputCurrentValue.length === 2) {
      return `${inputCurrentValue}:${parsedMinutes}`;
    }

    return `${inputCurrentValue.slice(0, 2)}:${parsedMinutes}`;
  }
}
