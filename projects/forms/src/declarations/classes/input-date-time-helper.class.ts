import { isNil } from '@bimeister/utilities';
import { getFormattedTimeDigit } from '@bimeister/pupakit.common';
import { ParsedTimeData } from '../interfaces/parsed-time-data.interface';
import { ParsedDateData } from '../interfaces/parsed-date-data.interface';
import { NumericParsedTimeData } from '../types/numeric-parsed-time-data.type';

export class InputDateTimeHelper {
  public static getUpdatedValueStringAfterSelectHours(hours: number, inputCurrentValue: string): string {
    const parsedHours: string = getFormattedTimeDigit(hours);
    const { minutes, seconds }: Partial<ParsedTimeData> = this.getParsedTimeData(inputCurrentValue);

    return `${parsedHours}:${minutes}:${seconds}`;
  }

  public static getUpdatedValueStringAfterSelectMinutes(minutes: number, inputCurrentValue: string): string {
    const parsedMinutes: string = getFormattedTimeDigit(minutes);
    const { hours, seconds }: Partial<ParsedTimeData> = this.getParsedTimeData(inputCurrentValue);

    return `${hours}:${parsedMinutes}:${seconds}`;
  }

  public static getUpdatedValueStringAfterSelectSeconds(seconds: number, inputCurrentValue: string): string {
    const parsedSeconds: string = getFormattedTimeDigit(seconds);
    const { hours, minutes }: Partial<ParsedTimeData> = this.getParsedTimeData(inputCurrentValue);

    return `${hours}:${minutes}:${parsedSeconds}`;
  }

  public static getParsedDateData(inputValue: string): ParsedDateData {
    const defaultDateParts: string[] = ['00', '00', '0000'];
    const allowedTimePartsLength: number = defaultDateParts.length;

    const convertedDefaultDateParts: string = defaultDateParts.join('.');

    const serializedValue: string = isNil(inputValue) ? convertedDefaultDateParts : inputValue;
    const parsedDateParts: string[] = serializedValue.split('.');

    const dateParts: string[] = [...parsedDateParts, ...defaultDateParts].slice(0, allowedTimePartsLength);

    return { day: dateParts[0], month: dateParts[1], year: dateParts[2] };
  }

  public static getParsedNumericTimeData(inputValue: string): NumericParsedTimeData {
    const { hours, minutes, seconds }: ParsedTimeData = InputDateTimeHelper.getParsedTimeData(inputValue);

    return {
      hours: Number(hours),
      minutes: Number(minutes),
      seconds: Number(seconds),
    };
  }

  public static getParsedTimeData(inputValue: string): ParsedTimeData {
    const defaultTimeParts: string[] = ['00', '00', '00'];
    const allowedTimePartsLength: number = defaultTimeParts.length;

    const convertedDefaultTimeParts: string = defaultTimeParts.join(':');

    const serializedValue: string = isNil(inputValue) ? convertedDefaultTimeParts : inputValue;
    const parsedTimeParts: string[] = serializedValue
      .split(':')
      .map((timePart: string) => getFormattedTimeDigit(Number(timePart)));

    const timeParts: string[] = [...parsedTimeParts, ...defaultTimeParts].slice(0, allowedTimePartsLength);

    return { hours: timeParts[0], minutes: timeParts[1], seconds: timeParts[2] };
  }
}
