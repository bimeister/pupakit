import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab } from 'src/lib/tabs/components/tabs/tabs.component';

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
      route: '/tabs?users=user1',
      removeExistingQueryParams: true
    },
    {
      name: 'Ad/Ldap',
      iconName: 'ios-albums',
      route: '/tabs?tab=1'
    },
    {
      name: 'Управление ролями',
      iconName: 'ios-hammer',
      route: '/tabs?tab=2'
    }
  ];
}
