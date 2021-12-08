import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core';

import { SelectOptionsContainerBase } from '../../../../../internal/declarations/classes/abstract/select-options-container-base.abstract';

@Component({
  selector: 'pupa-select-options-container',
  templateUrl: './select-options-container.component.html',
  styleUrls: ['./select-options-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionsContainerComponent extends SelectOptionsContainerBase {
  @HostListener('click', ['$event'])
  @HostListener('touchstart', ['$event'])
  public stopPropagation(event: Event): void {
    this.processDomEvent(event);
  }
}
