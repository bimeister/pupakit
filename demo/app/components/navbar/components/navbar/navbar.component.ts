import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, Injector, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { filterTruthy } from '@bimeister/utilities';

import { ThemeWrapperService } from '../../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Theme } from '../../../../../../src/internal/declarations/enums/theme.enum';
import { DrawersService } from '../../../../../../src/internal/shared/services/drawers.service';
import { OpenedDrawer } from '../../../../../../src/internal/declarations/interfaces/opened-drawer.interface';
import { SidebarContentComponent } from '../../../sidebar/sidebar-content/sidebar-content.component';

@Component({
  selector: 'demo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnDestroy {
  public readonly logo$: Observable<SafeResourceUrl> = this.themeWrapperService.theme$.pipe(
    map((themeMode: Theme) => {
      return themeMode === Theme.Light ? this.logoLight : this.logoDark;
    })
  );

  private readonly logoDark: SafeResourceUrl;
  private readonly logoLight: SafeResourceUrl;
  public readonly logoMini: SafeResourceUrl;

  private readonly subscription: Subscription = new Subscription();

  private readonly openedDrawerInitialValue: OpenedDrawer = {
    id: null,
    closed$: of(null)
  };

  public isMenuOpen: FormControl = new FormControl(false);

  private readonly menuOpen$: Observable<true> = this.isMenuOpen.valueChanges.pipe(filterTruthy());

  private readonly openedDrawer$: BehaviorSubject<OpenedDrawer> = new BehaviorSubject<OpenedDrawer>(
    this.openedDrawerInitialValue
  );

  private readonly drawerOpened$: Observable<OpenedDrawer> = this.openedDrawer$.pipe(
    filter((openDrawer: OpenedDrawer) => typeof openDrawer.id === 'string')
  );

  private readonly drawerClosed$: Observable<null> = this.drawerOpened$.pipe(
    switchMap((openDrawer: OpenedDrawer) => openDrawer.closed$)
  );

  constructor(
    private readonly themeWrapperService: ThemeWrapperService,
    private readonly sanitizer: DomSanitizer,
    private readonly drawerService: DrawersService,
    private readonly injector: Injector
  ) {
    this.logoLight = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-light.svg');
    this.logoDark = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-dark.svg');
    this.logoMini = this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo-mini.svg');

    this.subscription.add(this.closeMenuWhenDrawerClosed());
    this.subscription.add(this.openDrawerWhenMenuOpen());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public handleToggleNavbar(isOpen: boolean): void {
    this.isMenuOpen.setValue(isOpen);

    if (!isOpen) {
      this.closeDrawer();
    }
  }

  private closeMenuWhenDrawerClosed(): Subscription {
    return this.drawerClosed$.subscribe(() => {
      this.openedDrawer$.next({ ...this.openedDrawerInitialValue });
      this.isMenuOpen.setValue(false);
    });
  }

  private openDrawerWhenMenuOpen(): Subscription {
    return this.menuOpen$.subscribe(() => {
      const openedDrawer: OpenedDrawer = this.openDrawer();
      this.openedDrawer$.next(openedDrawer);
    });
  }

  private openDrawer(): OpenedDrawer {
    return this.drawerService.open(SidebarContentComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: true,
      isBackdropTransparent: false,
      float: 'left',
      injector: this.injector
    });
  }

  private closeDrawer(): void {
    this.drawerOpened$
      .pipe(
        map((openDrawer: OpenedDrawer) => openDrawer.id),
        take(1)
      )
      .subscribe((id: string) => {
        this.drawerService.closeById(id);
        this.openedDrawer$.next({ ...this.openedDrawerInitialValue });
      });
  }
}
