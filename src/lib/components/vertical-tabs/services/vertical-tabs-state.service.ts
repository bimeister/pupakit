import { Injectable } from '@angular/core';
import { TabsStateProducerService } from '../../../../internal/declarations/classes/abstract/tabs-state-producer-service.abstract';

@Injectable()
export class VerticalTabsStateService extends TabsStateProducerService {
  constructor() {
    super();
  }
}
