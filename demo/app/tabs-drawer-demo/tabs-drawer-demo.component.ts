import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Tab } from 'src/lib/core/components/tabs/tabs.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'demo-tabs-demo',
  templateUrl: './tabs-drawer-demo.component.html',
  styleUrls: ['./tabs-drawer-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsDrawerDemoComponent implements OnDestroy {
  private readonly sub: Subscription = new Subscription();
  public drawerOpen: boolean = false;
  public drawerOpen$: Observable<boolean> = this.route.queryParams.pipe(
    map((queryParams: any) => queryParams.drawerOpen === 'true')
  );
  public tabs: Tab[] = [
    {
      name: 'Ad/Ldap',
      iconName: 'ios-albums',
      urlTree: this.router.createUrlTree(['/tabs-drawer'], { queryParams: { tabs: '1' } })
    },
    {
      name: 'Управление ролями',
      iconName: 'ios-hammer',
      urlTree: this.router.createUrlTree(['/tabs-drawer'], { queryParams: { tabs: '2' } })
    }
  ];
  constructor(
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly route: ActivatedRoute
  ) {
    this.sub.add(
      this.drawerOpen$.subscribe((drawerOpen: boolean) => {
        this.drawerOpen = drawerOpen;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public toggleDrawer(): void {
    if (this.drawerOpen) {
      this.router.navigateByUrl('/tabs-drawer');
    } else {
      this.router.navigateByUrl('/tabs-drawer?drawerOpen=true&tabs=1');
    }
  }
}
