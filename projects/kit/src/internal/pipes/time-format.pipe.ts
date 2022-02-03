import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from '@bimeister/utilities';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  public transform(entity: unknown): string {
    if (isNil(entity)) {
      return '00';
    }

    const incomingNumber: number = parseInt(entity?.toString(), 10);

    if (isNaN(incomingNumber)) {
      return incomingNumber.toString();
    }

    return incomingNumber.toString().padStart(2, '0');
  }
}
