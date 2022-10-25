import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Renderer2, ViewEncapsulation } from '@angular/core';
import { Theme, ThemeService } from '@bimeister/pupakit.common';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

enum IconNames {
  DARK = 'ios-moon',
  LIGHT = 'ios-sunny',
}

enum AnimationStates {
  START = 'start',
  END = 'end',
}

const COLOR_BASE_WHITE_N100: string = '#3d5159';
const COLOR_BASE_DARK_N500: string = '#0f2a36';

@Component({
  selector: 'demo-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('rotateIcon', [
      transition(`${AnimationStates.START} => ${AnimationStates.END}`, [
        animate(
          '0.25s',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: 0 }),
            style({ transform: 'rotate(180deg)', offset: 1 }),
          ])
        ),
      ]),
      transition(`${AnimationStates.END} => ${AnimationStates.START}`, [
        animate(
          '0.25s',
          keyframes([
            style({ transform: 'rotate(360deg)', offset: 0 }),
            style({ transform: 'rotate(0deg)', offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class ThemeToggleComponent {
  private readonly isDarkMode$: Observable<boolean> = this.themeService.theme$.pipe(
    map((theme: Theme) => theme === Theme.Dark)
  );

  public readonly iconName$: Observable<IconNames> = this.isDarkMode$.pipe(
    map((isDarkMode: boolean) => (isDarkMode ? IconNames.LIGHT : IconNames.DARK))
  );

  public readonly animationState$: Observable<string> = this.isDarkMode$.pipe(
    map((isDarkMode: boolean) => (isDarkMode ? AnimationStates.END : AnimationStates.START))
  );

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly themeService: ThemeService,
    private readonly renderer: Renderer2
  ) {
    this.setInitialBrowserToolbarTheme();
  }

  public toggleDarkMode(): void {
    this.themeService.toggleTheme();
  }

  private setInitialBrowserToolbarTheme(): void {
    this.themeService.theme$.pipe(take(1)).subscribe((theme: Theme) => this.setBrowserToolbarTheme(theme));
  }

  private setBrowserToolbarTheme(theme: Theme): void {
    const themeColor: HTMLMetaElement = this.document.head.querySelector('meta[name=theme-color]');

    switch (theme) {
      case Theme.Light:
        this.renderer.setAttribute(themeColor, 'content', COLOR_BASE_WHITE_N100);
        return;
      case Theme.Dark:
        this.renderer.setAttribute(themeColor, 'content', COLOR_BASE_DARK_N500);
        return;
      default:
        return;
    }
  }
}
