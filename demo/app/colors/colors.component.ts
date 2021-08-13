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
    'white',
    'primary-n100',
    'primary-n200',
    'primary-n300',
    'primary-n400',
    'primary-n500',
    'base-n600',
    'base-dark-n100',
    'base-dark-n250',
    'base-dark-n275',
    'base-dark-n300',
    'base-dark-n500',
    'base-white-n250',
    'base-white-n275',
    'base-white-n400',
    'base-white-n500',
    'green-n400',
    'green-n500',
    'yellow-n500',
    'red-n400',
    'red-n500',
    'red-n550'
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
