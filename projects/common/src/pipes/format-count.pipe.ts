import { Pipe, PipeTransform } from '@angular/core';
import { getAbbreviatedCount, isNil } from '@bimeister/utilities';

@Pipe({
  name: 'formatCount',
  pure: true,
})
export class FormatCountPipe implements PipeTransform {
  public transform(count: number | null, maxCounterNumber?: number | null): string {
    if (isNil(count)) {
      return '';
    }

    if (!isNil(maxCounterNumber) && count > maxCounterNumber) {
      return `${maxCounterNumber}+`;
    }

    return getAbbreviatedCount(count);
  }
}
