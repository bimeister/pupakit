import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tab } from '../../../src/internal/declarations/interfaces/tab.interface';

type TabWithIcon = Tab & { iconName: string };

@Component({
  selector: 'demo-tabs-demo',
  templateUrl: './tabs-demo.component.html',
  styleUrls: ['./tabs-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsDemoComponent {
  public readonly tabs: TabWithIcon[] = [
    {
      value: 'adldap',
      isActive: false,
      name: 'AD/LDAP',
      iconName: 'ios-albums'
    },
    {
      value: 'roles',
      isActive: false,
      name: 'Роли',
      iconName: 'ios-hammer'
    },
    {
      value: 'users',
      isActive: true,
      name: 'Пользователи',
      iconName: 'ios-person'
    },
    {
      value: 'groups',
      isActive: false,
      name: 'Группы',
      iconName: 'ios-people'
    },
    {
      value: 'mail',
      isActive: false,
      name: 'Почтовый сервер',
      iconName: 'ios-mail'
    },
    {
      value: 'logs',
      isActive: false,
      name: 'Журнал',
      iconName: 'ios-journal'
    }
  ];

  public readonly activeValues$: BehaviorSubject<unknown[]> = new BehaviorSubject<unknown[]>(
    this.tabs.filter(({ isActive }: TabWithIcon) => isActive).map(({ value }: TabWithIcon) => value)
  );

  public handleTabSelection(values: unknown[]): void {
    this.activeValues$.next(values);
  }

  public tabIsActive(value: unknown, activeValues: unknown[]): boolean {
    return activeValues.includes(value);
  }
}
