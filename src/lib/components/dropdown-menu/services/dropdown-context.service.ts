import { Injectable } from '@angular/core';
import { Uuid } from '../../../../internal/declarations/types/uuid.type';
import { getUuid } from '@bimeister/utilities';

@Injectable()
export class DropdownContextService {
  public readonly contextId: Uuid = getUuid();
}
