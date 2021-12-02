import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core';

import { SelectItemsContainerBase } from './../../../../../../internal/declarations/classes/abstract/select-items-container-base.abstract';

@Component({
  selector: 'pupa-select-items-container',
  templateUrl: './select-items-container.component.html',
  styleUrls: ['./select-items-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectItemsContainerComponent extends SelectItemsContainerBase {
  @HostListener('click', ['$event'])
  @HostListener('touchstart', ['$event'])
  public stopPropagation(event: Event): void {
    this.processDomEvent(event);
  }
}
