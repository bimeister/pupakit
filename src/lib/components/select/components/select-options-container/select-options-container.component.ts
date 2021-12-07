import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core';

import { SelectItemsContainerBase } from './../../../../../internal/declarations/classes/abstract/select-items-container-base.abstract';

@Component({
  selector: 'pupa-select-options-container',
  templateUrl: './select-options-container.component.html',
  styleUrls: ['./select-options-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionsContainerComponent extends SelectItemsContainerBase {
  @HostListener('click', ['$event'])
  @HostListener('touchstart', ['$event'])
  public stopPropagation(event: Event): void {
    this.processDomEvent(event);
  }
}
