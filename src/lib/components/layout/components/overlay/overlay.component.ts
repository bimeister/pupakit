import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pupa-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('showOverlay', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('false => true', animate('0.32s cubic-bezier(0.97, 0.84, .03, 0.95)')),
      transition('true => false', animate('0.2s ease-in-out')),
    ]),
  ],
})
export class OverlayComponent {
  @Input()
  public isVisible: boolean = false;

  @Input()
  public clickable: boolean = false;

  @Output()
  public onclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  public clickOverlay(event: MouseEvent): void {
    this.onclick.emit(event);
  }
}
