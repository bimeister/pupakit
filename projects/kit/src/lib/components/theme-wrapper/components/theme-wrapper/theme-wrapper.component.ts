import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, withLatestFrom } from 'rxjs/operators';
import { Theme } from '../../../../../internal/declarations/enums/theme.enum';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ThemeWrapperService } from '../../services/theme-wrapper.service';

@Component({
  selector: 'pupa-theme-wrapper',
  templateUrl: './theme-wrapper.component.html',
  styleUrls: ['./theme-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ThemeWrapperService],
})
export class ThemeWrapperComponent implements OnChanges, OnInit, OnDestroy {
  @Input() public theme: Theme;

  private readonly themeClass$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly themeWrapperService: ThemeWrapperService,
    private readonly renderer: Renderer2,
    private readonly hostElement: ElementRef
  ) {}

  public ngOnInit(): void {
    this.subscription.add(this.processThemeClass());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processThemeChange(changes?.theme);
  }

  private processThemeChange(change: ComponentChange<this, Theme>): void {
    this.themeWrapperService.setTheme(change?.currentValue);
  }

  private processThemeClass(): Subscription {
    return this.themeWrapperService.themeClass$
      .pipe(distinctUntilChanged(), withLatestFrom(this.themeClass$))
      .subscribe(([themeClass, localThemeClass]: [string, string | null]) => {
        this.renderer.addClass(this.hostElement.nativeElement, themeClass);

        if (!isNil(localThemeClass)) {
          this.renderer.removeClass(this.hostElement.nativeElement, localThemeClass);
        }

        this.themeClass$.next(themeClass);
      });
  }
}
