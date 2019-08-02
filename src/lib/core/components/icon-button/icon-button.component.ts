import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';
import { ButtonType } from '../button/button.component';

export type InputButtonColor = 'dark' | 'light';
export type InputButtonSize = 'small' | 'medium' | 'large';
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
  @Input() public type: ButtonType = 'submit';

  @Output() public onclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

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
}
