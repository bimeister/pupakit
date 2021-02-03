import { Injectable } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { ParsedDateData } from '../../../../internal/declarations/interfaces/parsed-date-data.interface';
import { ParsedTimeData } from '../../../../internal/declarations/interfaces/parsed-time-data.interface';
import { TimeFormatPipe } from '../../../../internal/pipes/time-format.pipe';

@Injectable({ providedIn: 'any' })
export class InputDateTimeStateService {
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

  public getParsedDateData(inputValue: string): ParsedDateData {
    const defaultDateParts: string[] = ['00', '00', '0000'];
    const allowedTimePartsLength: number = defaultDateParts.length;

    const convertedDefaultDateParts: string = defaultDateParts.join('.');

    const serializedValue: string = isNil(inputValue) ? convertedDefaultDateParts : inputValue;
    const parsedDateParts: string[] = serializedValue.split('.');

    const dateParts: string[] = [...parsedDateParts, ...defaultDateParts].slice(0, allowedTimePartsLength);

    return { day: dateParts[0], month: dateParts[1], year: dateParts[2] };
  }

  public getParsedTimeData(inputValue: string): ParsedTimeData {
    const defaultTimeParts: string[] = ['00', '00', '00'];
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
