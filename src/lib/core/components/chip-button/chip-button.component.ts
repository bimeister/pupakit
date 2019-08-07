import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'pupa-chip-button',
  templateUrl: './chip-button.component.html',
  styleUrls: ['./chip-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipButtonComponent {
  @ViewChild('chipButtonElement', { static: true }) public chipButtonElement: ElementRef<HTMLButtonElement>;
  @Input() public disabled: boolean = false;

  @Output() public onclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  public processClickEvent(event: MouseEvent): void {
    this.chipButtonElement.nativeElement.blur();
    if (this.disabled) {
      return;
    }
    this.onclick.emit(event);
  }
}
