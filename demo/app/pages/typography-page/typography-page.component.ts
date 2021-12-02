import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-typography-page',
  templateUrl: './typography-page.component.html',
  styleUrls: ['./typography-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypographyPageComponent {
  public fontTypes: string[] = ['point', 'caption', 'paragraph'];
  public fontSizes: string[] = ['header', 'large', 'medium', 'small', 'mark'];
  public screenSizes: string[] = ['desktop', 'tablet', 'mobile'];
}
