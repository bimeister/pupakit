import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab } from 'src/lib/core/components/tabs/tabs.component';

@Component({
  selector: 'demo-tabs-demo',
  templateUrl: './tabs-demo.component.html',
  styleUrls: ['./tabs-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsDemoComponent {
  public tabs: Tab[] = [
    {
      name: 'Ad/Ldap',
      iconName: 'ios-albums'
    },
    {
      name: 'Управление ролями',
      iconName: 'ios-hammer'
    }
  ];
}
