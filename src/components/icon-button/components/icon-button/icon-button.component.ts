import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { ButtonType } from '../../../../internal/declarations/types/button-type.type';
import { InputButtonColor } from '../../../../internal/declarations/types/icon-button-color.type';
import { InputButtonSize } from '../../../../internal/declarations/types/icon-button-size.type';
import { isNullOrUndefined } from '../../../../internal/helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconButtonComponent {
  @ViewChild('buttonElement', { static: true }) public buttonElement: ElementRef<HTMLButtonElement>;

  @Input() public color: InputButtonColor = 'light';
  @Input() public disabled: boolean = false;
  @Input() public active: boolean = false;
  @Input() public size: InputButtonSize = 'small';
  @Input() public isFloat: boolean = false;
  @Input() public fixed: boolean = false;
  @Input() public repeatClick: boolean = false;

  @Input() public type: ButtonType = 'submit';

  @Output() public onclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  private timerRepeatClick: any = null;
  private timeRepeat: number;
  private readonly firstTimeOut: number = 800;
  private readonly timeOut: number = 100;

  constructor(private readonly elementRef: ElementRef) {}

  public get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  public get resultClassList(): string[] {
    return [this.color, this.size, this.active ? 'active' : null]
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
