import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pupa-close-button',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloseButtonComponent {
  @Output()
  public onclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  public clickButton(event: MouseEvent): void {
    this.onclick.emit(event);
  }
}
