import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'log'
})
export class LogPipe implements PipeTransform {
  public transform(...data: any): void {
    // tslint:disable-next-line: no-console
    console.log(...data);
  }
}
