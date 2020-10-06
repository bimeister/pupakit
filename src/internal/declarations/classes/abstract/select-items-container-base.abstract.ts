import { Directive } from '@angular/core';

@Directive()
export abstract class SelectItemsContainerBase {
  protected processDomEvent(event: Event): void {
    event.stopPropagation();
  }
}
