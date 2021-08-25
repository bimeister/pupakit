import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-scrollbar-demo',
  templateUrl: './scrollbar-demo.component.html',
  styleUrls: ['./scrollbar-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarDemoComponent {}
