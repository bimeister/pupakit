import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { ButtonColor, ButtonIcon, ButtonKind, ButtonSize, ButtonType, isNullOrUndefined } from '../../../../internal';

@Component({
  selector: 'pupa-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @ViewChild('buttonElement', { static: true }) public buttonElement: ElementRef<HTMLButtonElement>;
  @Input() public type: ButtonType = 'submit';
  @Input() public kind: ButtonKind = 'solid';
  @Input() public size: ButtonSize = 'medium';
  @Input() public color: ButtonColor = 'normal';
  @Input() public disabled: boolean = false;
  @Input() public icon: ButtonIcon = null;
  @Input() public loader: boolean = false;
  @Input() public repeatClick: boolean = false;

  @Output() public onclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  private timerRepeatClick: any = null;
  private timeRepeat: number;
  private readonly firstTimeOut: number = 800;
  private readonly timeOut: number = 100;

  public get resultClassList(): string[] {
    return [this.kind, this.size, this.color, this.loader ? 'with-loader' : null]
      .filter((innerClass: string) => !isNullOrUndefined(innerClass))
      .map((innerProperty: string) => `button_${innerProperty}`);
  }

  public processClickEvent(event: MouseEvent): void {
    this.buttonElement.nativeElement.blur();
    if (this.disabled) {
      return;
    }
    this.onclick.emit(event);
  }

  public processMouseDownEvent(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.repeatClick) {
      return;
    }
    this.timeRepeat = this.firstTimeOut;
    this.newRepeatClick(event);
  }

  public processMouseUpEvent(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.repeatClick) {
      return;
    }
    clearTimeout(this.timerRepeatClick);
  }

  private newRepeatClick(event: MouseEvent): void {
    this.timerRepeatClick = setTimeout(() => {
      this.timeRepeat = this.timeOut;
      this.onclick.emit(event);
      this.newRepeatClick(event);
    }, this.timeRepeat);
  }
}
