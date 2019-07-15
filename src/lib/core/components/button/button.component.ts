import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonType = 'solid' | 'outlined' | 'link';
export type ButtonSize = 'large' | 'medium' | 'small';
export type ButtonColor = 'normal' | 'negative' | 'positive' | 'alert';
@Component({
  selector: 'pupa-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() public type: ButtonType = 'solid';
  @Input() public size: ButtonSize = 'medium';
  @Input() public color: ButtonColor = 'normal';
  @Input() public disabled: boolean = false;

  @Output() public onclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  public processClickEvent(event: MouseEvent): void {
    if (this.disabled) {
      return;
    }
    this.onclick.emit(event);
  }

  public getResultClassList(prefix: string): string[] {
    return [this.type, this.size, this.color].map((innerProperty: string) => `${prefix}${innerProperty}`);
  }
}
