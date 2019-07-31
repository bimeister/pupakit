import { Component } from '@angular/core';
import { WasherButton, WasherButtonRoot } from 'src/lib/core/components/washer-panel/washer-panel.component';

@Component({
  selector: 'demo-washer-panel-demo',
  templateUrl: './washer-panel-demo.component.html',
  styleUrls: ['./washer-panel-demo.component.scss']
})
export class WasherPanelDemoComponent {
  public centralButton: WasherButton = {
    actionName: 'home',
    icon: 'home'
  };
  public buttons: WasherButtonRoot[] = [
    {
      actionName: `${Math.random()}`,
      icon: 'move',
      isAlwaysVisible: true,
      rangeOnClick: false,
      children: [
        {
          actionName: `${Math.random()}`,
          icon: 'close'
        },
        {
          actionName: `${Math.random()}`,
          icon: 'close'
        }
      ]
    },
    { actionName: `${Math.random()}`, icon: 'move', isAlwaysVisible: true, rangeOnClick: false },
    { actionName: `${Math.random()}`, icon: 'move', isAlwaysVisible: false, rangeOnClick: false },
    { actionName: `${Math.random()}`, icon: 'move', isAlwaysVisible: true, rangeOnClick: true }
  ];

  private readonly sampleArrayItem: WasherButtonRoot = {
    actionName: `${Math.random()}`,
    icon: 'move',
    isAlwaysVisible: true,
    rangeOnClick: false
  };

  public onAddClick(): void {
    this.buttons = [
      ...this.buttons,
      {
        ...this.sampleArrayItem,
        // tslint:disable: no-magic-numbers
        isAlwaysVisible: Math.random() > 0.5,
        rangeOnClick: Math.random() > 0.7,
        actionName: `${Math.random()}`

        // tslint:enable: no-magic-numbers
      }
    ];
  }

  public onRemoveClick(): void {
    this.buttons = [...this.buttons.slice(1, this.buttons.length)];
  }

  public log(...data: unknown[]): void {
    // tslint:disable-next-line: no-console
    console.log(...data);
  }
}
