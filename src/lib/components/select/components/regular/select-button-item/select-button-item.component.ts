import { Component, ViewEncapsulation, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'pupa-select-button-item',
  templateUrl: './select-button-item.component.html',
  styleUrls: ['./select-button-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectButtonItemComponent {
  @Input() public withClose: boolean = true;
  @Output() public readonly closeClick: EventEmitter<void> = new EventEmitter();

  public onCloseClick(event: Event): void {
    this.closeClick.emit();
    event.stopPropagation();
  }
}
