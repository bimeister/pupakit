import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from '@bimeister/utilities';

@Pipe({
  name: 'isNullOrUndefined'
})
export class IsNullOrUndefinedPipe implements PipeTransform {
  public transform(entity: unknown): boolean {
    return isNil(entity);
  }
}
