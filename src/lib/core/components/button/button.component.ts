import { Component, Input } from '@angular/core';

export type ButtonType = 'solid' | 'outlined' | 'link';
export type ButtonSize = 'large' | 'medium' | 'small';
export type ButtonColor = 'normal' | 'negative' | 'positive' | 'alert';
@Component({
  selector: 'pupa-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() public type: ButtonType = 'solid';
  @Input() public size: ButtonSize = 'medium';
  @Input() public color: ButtonColor = 'normal';

  public getResultClassList(prefix: string): string[] {
    return [this.type, this.size, this.color].map((innerProperty: string) => `${prefix}${innerProperty}`);
  }
}
