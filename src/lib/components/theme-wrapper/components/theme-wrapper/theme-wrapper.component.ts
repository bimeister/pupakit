import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { Theme } from '../../../../../internal/declarations/enums/theme.enum';
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
  @Input() public theme: Theme = Theme.Light;
  @HostBinding('class') public themeClass: string;
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly themeWrapperService: ThemeWrapperService) {}

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
    return this.themeWrapperService.themeClass$.subscribe((themeClass: string) => (this.themeClass = themeClass));
  }
}
