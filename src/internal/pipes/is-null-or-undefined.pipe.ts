import { Pipe, PipeTransform } from '@angular/core';

import { isNullOrUndefined } from '../helpers/is-null-or-undefined.helper';

@Pipe({
  name: 'isNullOrUndefined'
})
export class IsNullOrUndefinedPipe implements PipeTransform {
  public transform(entity: unknown): boolean {
    return isNullOrUndefined(entity);
  }
}
