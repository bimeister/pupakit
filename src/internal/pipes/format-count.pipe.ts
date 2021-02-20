import { Pipe, PipeTransform } from '@angular/core';
import { formatCount, isNil } from '@bimeister/utilities';

@Pipe({
  name: 'formatCount',
  pure: true
})
export class FormatCountPipe implements PipeTransform {
  public transform(count: number): string {
    if (isNil(count)) {
      return '';
    }
    return formatCount(count);
  }
}
