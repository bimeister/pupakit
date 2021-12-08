import { Directive } from '@angular/core';

@Directive()
export abstract class SelectOptionsContainerBase {
  protected processDomEvent(event: Event): void {
    event.stopPropagation();
  }
}
