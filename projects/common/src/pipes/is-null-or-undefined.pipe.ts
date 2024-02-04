import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from '@bimeister/utilities';

@Pipe({
  name: 'isNullOrUndefined',
})
export class IsNullOrUndefinedPipe implements PipeTransform {
  public transform(entity: unknown): entity is null | undefined {
    return isNil(entity);
  }
}
