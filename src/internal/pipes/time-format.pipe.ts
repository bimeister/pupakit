import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from '@meistersoft/utilities';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  public transform(entity: unknown): string {
    if (isNil(entity)) {
      return '00';
    }

    const incomingNumber: number = parseInt(entity?.toString(), 10);
    return incomingNumber < 10 ? `0${incomingNumber}` : `${incomingNumber}`;
  }
}
