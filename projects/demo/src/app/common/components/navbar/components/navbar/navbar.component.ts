import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { filterTruthy, isNil, mapToVoid, Nullable } from '@bimeister/utilities';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { OpenedDrawer } from '@kit/internal/declarations/interfaces/opened-drawer.interface';
import { DrawersService } from '@kit/internal/shared/services/drawers.service';
import { DrawerContainerComponent } from '@kit/lib/components/drawer/components/drawer-container/drawer-container.component';
import { ThemeWrapperService } from '@kit/lib/components/theme-wrapper/services/theme-wrapper.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AnchorService } from '../../../../services/anchor.service';
import { ConfigService } from '../../../../services/config.service';
import { SidebarDrawerContentContainerComponent } from '../sidebar-drawer-content-container/sidebar-drawer-content-container.component';

@Component({
  selector: 'demo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfigService],
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  public readonly linkToGithubPupakit: string = 'https://github.com/bimeister/pupakit';

  public readonly logo$: Observable<SafeResourceUrl> = this.themeWrapperService.theme$.pipe(
    map((themeMode: Theme) => (themeMode === Theme.Light ? this.logoLight : this.logoDark))
  );
  public readonly version$: Observable<string> = this.configService.getVersionPupakit();

  @ViewChild('navRef', { static: true })
  private readonly navRef: ElementRef<HTMLElement>;

  private readonly logoDark: SafeResourceUrl;
  private readonly logoLight: SafeResourceUrl;
  public readonly logoIcon: SafeResourceUrl;
  public readonly santaHatIcon: Nullable<SafeResourceUrl>;

  private readonly subscription: Subscription = new Subscription();

  public readonly isMenuOpenedControl: FormControl = new FormControl(false);

  private readonly menuOpened$: Observable<void> = this.isMenuOpenedControl.valueChanges.pipe(
    filterTruthy(),
    mapToVoid()
  );

  private readonly currentOpenedDrawer$: BehaviorSubject<OpenedDrawer> = new BehaviorSubject<OpenedDrawer>(null);

  private readonly drawerOpened$: Observable<OpenedDrawer> = this.currentOpenedDrawer$.pipe(
    filter((currentOpenedDrawer: OpenedDrawer) => !isNil(currentOpenedDrawer?.id))
  );

  private readonly drawerClosed$: Observable<null> = this.drawerOpened$.pipe(
    switchMap((openDrawer: OpenedDrawer) => openDrawer.closed$)
  );

  private get isNewYearTime(): boolean {
    const currentDate: Date = new Date();
    const startDate: Date = new Date(currentDate.getFullYear(), 11, 15);
    const endDate: Date = new Date(currentDate.getFullYear() + 1, 1, 15);

    return startDate <= currentDate && currentDate <= endDate;
  }

  constructor(
    private readonly anchorService: AnchorService,
    private readonly themeWrapperService: ThemeWrapperService,
    private readonly sanitizer: DomSanitizer,
    private readonly drawerService: DrawersService,
    private readonly configService: ConfigService,
    private readonly injector: Injector
  ) {
    this.logoLight = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-light.svg');
    this.logoDark = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-dark.svg');
    this.logoIcon = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-icon.svg');
    if (this.isNewYearTime) {
      this.santaHatIcon = this.sanitizer.bypassSecurityTrustResourceUrl('assets/santa-hat.svg');
    }

    this.subscription.add(this.closeMenuWhenDrawerClosed());
    this.subscription.add(this.openDrawerWhenMenuOpen());
  }

  public ngAfterViewInit(): void {
    this.setAnchorsRequiredIndentFromTop();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public handleToggleNavbar(isOpen: boolean): void {
    this.isMenuOpenedControl.setValue(isOpen);

    if (!isOpen) {
      this.closeDrawer();
    }
  }

  private closeMenuWhenDrawerClosed(): Subscription {
    return this.drawerClosed$.subscribe(() => {
      this.currentOpenedDrawer$.next(null);
      this.isMenuOpenedControl.setValue(false);
    });
  }

  private openDrawerWhenMenuOpen(): Subscription {
    return this.menuOpened$.pipe(switchMap(() => this.getOpenedDrawer())).subscribe((openedDrawer: OpenedDrawer) => {
      this.currentOpenedDrawer$.next(openedDrawer);
    });
  }

  private getOpenedDrawer(): Observable<OpenedDrawer> {
    return this.themeWrapperService.theme$.pipe(
      take(1),
      map((theme: Theme) =>
        this.drawerService.open(SidebarDrawerContentContainerComponent, {
          hasBackdrop: true,
          hasPadding: false,
          closeOnBackdropClick: true,
          isBackdropTransparent: false,
          float: 'left',
          injector: this.injector,
          isFullscreen: true,
          containerComponent: DrawerContainerComponent,
          theme,
        })
      )
    );
  }

  private closeDrawer(): void {
    this.drawerOpened$
      .pipe(
        map((openDrawer: OpenedDrawer) => openDrawer.id),
        take(1)
      )
      .subscribe((id: string) => {
        this.drawerService.closeById(id);
        this.currentOpenedDrawer$.next(null);
      });
  }

  private setAnchorsRequiredIndentFromTop(): void {
    const navbarHeight: number = this.navRef.nativeElement.clientHeight;
    this.anchorService.setScrollableParentRequiredIndentFromTop(navbarHeight);
  }
}
