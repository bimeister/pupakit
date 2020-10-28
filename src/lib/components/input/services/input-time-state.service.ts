import { Injectable } from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { TimeFormatPipe } from '../../../../internal/pipes/time-format.pipe';

interface ParsedTimeData {
  hours: string;
  minutes: string;
  seconds: string;
}

@Injectable({ providedIn: 'any' })
export class InputTimeStateService {
  constructor(private readonly timeFormatPipe: TimeFormatPipe) {}

  public getUpdatedValueStringAfterSelectHours(hours: number, inputCurrentValue: string): string {
    const parsedHours: string = this.timeFormatPipe.transform(hours);
    const { minutes, seconds }: Partial<ParsedTimeData> = this.getParsedTimeData(inputCurrentValue);

    return `${parsedHours}:${minutes}:${seconds}`;
  }

  public getUpdatedValueStringAfterSelectMinutes(minutes: number, inputCurrentValue: string): string {
    const parsedMinutes: string = this.timeFormatPipe.transform(minutes);
    const { hours, seconds }: Partial<ParsedTimeData> = this.getParsedTimeData(inputCurrentValue);

    return `${hours}:${parsedMinutes}:${seconds}`;
  }

  public getUpdatedValueStringAfterSelectSeconds(seconds: number, inputCurrentValue: string): string {
    const parsedSeconds: string = this.timeFormatPipe.transform(seconds);
    const { hours, minutes }: Partial<ParsedTimeData> = this.getParsedTimeData(inputCurrentValue);

    return `${hours}:${minutes}:${parsedSeconds}`;
  }

  private getParsedTimeData(inputValue: string): Partial<ParsedTimeData> {
    const defaultArray: string[] = ['00', '00', '00'];
    const defaultTimeParts: string[] = defaultArray;
    const allowedTimePartsLength: number = defaultTimeParts.length;

    const convertedDefaultTimeParts: string = defaultTimeParts.join(':');

    const serializedValue: string = isNil(inputValue) ? convertedDefaultTimeParts : inputValue;
    const parsedTimeParts: string[] = serializedValue
      .split(':')
      .map((timePart: string) => this.timeFormatPipe.transform(Number(timePart)));

    const timeParts: string[] = [...parsedTimeParts, ...defaultTimeParts].slice(0, allowedTimePartsLength);

    return { hours: timeParts[0], minutes: timeParts[1], seconds: timeParts[2] };
  }
}
