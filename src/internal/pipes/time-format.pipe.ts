import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  public transform(entity: unknown): string {
    const incomingNumber: number = parseInt(entity?.toString(), 10);
    return incomingNumber < 10 ? `0${incomingNumber}` : `${incomingNumber}`;
  }
}
