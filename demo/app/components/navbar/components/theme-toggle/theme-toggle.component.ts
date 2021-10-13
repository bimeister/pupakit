import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Theme } from '../../../../../../src/internal/declarations/enums/theme.enum';
import { ThemeWrapperService } from '../../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';

enum IconNames {
  DARK = 'ios-moon',
  LIGHT = 'ios-sunny'
}

enum AnimationStates {
  START = 'start',
  END = 'end'
}

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
            style({ transform: 'rotate(180deg)', offset: 1 })
          ])
        )
      ]),
      transition(`${AnimationStates.END} => ${AnimationStates.START}`, [
        animate(
          '0.25s',
          keyframes([
            style({ transform: 'rotate(360deg)', offset: 0 }),
            style({ transform: 'rotate(0deg)', offset: 1 })
          ])
        )
      ])
    ])
  ]
})
export class ThemeToggleComponent {
  private readonly isDarkMode$: Observable<boolean> = this.themeWrapperService.theme$.pipe(
    map((theme: Theme) => theme === Theme.Dark)
  );

  public readonly iconName$: Observable<IconNames> = this.isDarkMode$.pipe(
    map((isDarkMode: boolean) => (isDarkMode ? IconNames.LIGHT : IconNames.DARK))
  );

  public readonly animationState$: Observable<string> = this.isDarkMode$.pipe(
    map((isDarkMode: boolean) => (isDarkMode ? AnimationStates.END : AnimationStates.START))
  );

  constructor(private readonly themeWrapperService: ThemeWrapperService) {}

  public toggleDarkMode(): void {
    this.isDarkMode$
      .pipe(
        take(1),
        map((isDarkMode: boolean) => (isDarkMode ? Theme.Light : Theme.Dark))
      )
      .subscribe((theme: Theme) => {
        this.themeWrapperService.setTheme(theme);
      });
  }
}
