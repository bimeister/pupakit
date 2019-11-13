import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab } from 'src/lib/core/components/tabs/tabs.component';
import { Router } from '@angular/router';

@Component({
  selector: 'demo-tabs-demo',
  templateUrl: './tabs-demo.component.html',
  styleUrls: ['./tabs-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsDemoComponent {
  public tabs: Tab[] = [
    {
      name: 'Пользователи',
      iconName: 'ios-hammer',
      routeTree: this.router.createUrlTree(['/tabs'], { queryParams: { users: 'user1' }, queryParamsHandling: 'merge' } )
    },
    {
      name: 'Ad/Ldap',
      iconName: 'ios-albums',
      routeTree: this.router.createUrlTree(['/tabs'], { queryParams: { tabs: '1' }, queryParamsHandling: 'merge' } )
    },
    {
      name: 'Управление ролями',
      iconName: 'ios-hammer',
      routeTree: this.router.createUrlTree(['/tabs'], { queryParams: { tabs: '2' }, queryParamsHandling: 'merge' } )
    }
  ];
  constructor(private router: Router) {}

}
