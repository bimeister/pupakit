import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-color-usage-example',
  templateUrl: './color-usage-example.component.html',
  styleUrls: ['./color-usage-example.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsColorUsageExampleComponent {}
