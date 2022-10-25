import { Pipe, PipeTransform } from '@angular/core';
import { getFormattedTimeDigit } from '../declarations/functions/get-formatted-time-digit.function';

@Pipe({
  name: 'timeDigitFormat',
})
export class TimeDigitFormatPipe implements PipeTransform {
  public transform(entity: unknown): string {
    return getFormattedTimeDigit(entity);
  }
}
