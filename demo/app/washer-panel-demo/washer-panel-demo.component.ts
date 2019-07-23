import { Component } from '@angular/core';
import { WasherButton } from 'dist/@meistersoft/pupakit/lib/core/components/washer-panel/washer-panel.component';

@Component({
  selector: 'demo-washer-panel-demo',
  templateUrl: './washer-panel-demo.component.html',
  styleUrls: ['./washer-panel-demo.component.scss']
})
export class WasherPanelDemoComponent {
  public buttons: WasherButton[] = [
    { actionName: '', icon: 'move', isAlwaysVisible: true },
    { actionName: '', icon: 'move', isAlwaysVisible: true },
    { actionName: '', icon: 'move', isAlwaysVisible: false },
    { actionName: '', icon: 'move', isAlwaysVisible: true }
  ];

  private readonly sampleArrayItem: WasherButton = { actionName: '', icon: 'move', isAlwaysVisible: true };

  public onAddClick(): void {
    this.buttons = [
      ...this.buttons,
      {
        ...this.sampleArrayItem,
        // tslint:disable-next-line: no-magic-numbers
        isAlwaysVisible: Math.random() > 0.5
      }
    ];
  }

  public onRemoveClick(): void {
    this.buttons = [...this.buttons.slice(1, this.buttons.length)];
  }
}
