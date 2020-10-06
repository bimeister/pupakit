import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core';

import { SelectItemsContainerBase } from './../../../../../../internal/declarations/classes/abstract/select-items-container-base.abstract';

@Component({
  selector: 'pupa-select-new-table-items-container',
  templateUrl: './select-new-table-items-container.component.html',
  styleUrls: ['./select-new-table-items-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectNewTableItemsContainerComponent extends SelectItemsContainerBase {
  @HostListener('click', ['$event'])
  @HostListener('touchstart', ['$event'])
  public stopPropagation(event: Event): void {
    this.processDomEvent(event);
  }
}
