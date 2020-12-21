import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorsComponent {
  public readonly colors: string[] = [
    'main',
    'main-dark',
    'accent',
    'active',
    'light',
    'success',
    'alert',
    'error',
    'text',
    'grey-light',
    'grey-ivory',
    'grey-apple',
    'white',
    'black',
    'pale-blue',
    'cadet-blue',
    'cadet-blue-light',
    'dark-overlay'
  ];

  public isColorLight(color: string): boolean {
    const bodyStyles: CSSStyleDeclaration = window.getComputedStyle(document.body);
    const colorPropertyValue: string = bodyStyles.getPropertyValue(`--color_${color}`).trim();
    const r: number = parseInt(colorPropertyValue.substr(1, 2), 16);
    const g: number = parseInt(colorPropertyValue.substr(3, 2), 16);
    const b: number = parseInt(colorPropertyValue.substr(5, 2), 16);
    return r + g + b > 255 * 2.5;
  }

  public getBackground(color: string): Record<string, string> {
    return {
      background: `var(--color_${color})`
    };
  }
}
