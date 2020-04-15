import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-select',
  styleUrls: ['../demo.scss', './selector-demo.component.scss'],
  templateUrl: './selector-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorDemoComponent {}
