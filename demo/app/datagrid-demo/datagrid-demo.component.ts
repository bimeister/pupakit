import { ChangeDetectionStrategy, Component } from '@angular/core';

interface DemoRowData {
  userName: string;
  userId: string;
  userGroup: string;
}

@Component({
  selector: 'demo-datagrid-demo',
  templateUrl: './datagrid-demo.component.html',
  styleUrls: ['./datagrid-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridDemoComponent {
  public readonly demoUsers: DemoRowData[] = [
    {
      userGroup: 'group 1',
      userId: '15112121',
      userName: 'Alyosha Popovich'
    },
    {
      userGroup: 'group 1',
      userId: '151134521',
      userName: 'Vasilisa Prekrasnaja'
    },
    {
      userGroup: 'group 2',
      userId: '666666666',
      userName: 'Znej Gorinich'
    }
  ];
}
