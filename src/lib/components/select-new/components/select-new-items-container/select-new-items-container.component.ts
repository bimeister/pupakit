import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-select-new-items-container',
  templateUrl: './select-new-items-container.component.html',
  styleUrls: ['./select-new-items-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectNewItemsContainerComponent {
  @HostListener('click', ['$event'])
  @HostListener('wheel', ['$event'])
  @HostListener('touchstart', ['$event'])
  public processClick(event: Event): void {
    event.stopPropagation();
  }
}
