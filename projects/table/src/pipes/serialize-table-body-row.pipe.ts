import { Pipe, PipeTransform } from '@angular/core';
import { TableBodyRow } from '../declarations/classes/table-body-row.class';
import { isNil } from '@bimeister/utilities';

/*
 * TODO: delete this pipe when https://jira.bimeister.io/browse/BIM-51747 is done
 * This was a temporary solution for the proper functioning of the automated tests
 */

@Pipe({
  name: 'serializeTableBodyRow',
  pure: true,
})
export class SerializeTableBodyRowPipe implements PipeTransform {
  public transform({ index, data }: TableBodyRow<unknown | null>): string {
    if (isNil(data)) {
      return `${index}__null`;
    }

    return `${index}__${JSON.stringify(data)}`;
  }
}
