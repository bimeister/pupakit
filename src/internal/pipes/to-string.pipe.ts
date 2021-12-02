import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ToString',
})
export class ToString implements PipeTransform {
  public transform(entity: unknown): string {
    return String(entity);
  }
}
