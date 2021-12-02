import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-draggable-list-demo',
  styleUrls: ['../demo.scss', './draggable-list-demo.component.scss'],
  templateUrl: './draggable-list-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DraggableListDemoComponent {
  public list: any[] = [
    {
      id: '1',
      content: '🐢',
    },
    {
      id: '2',
      content: '🐍',
    },
    {
      id: '3',
      content: '🦖',
    },
    {
      id: '4',
      content: '🐊',
    },
    {
      id: '5',
      content: '🦎',
    },
  ];
}
