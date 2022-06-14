import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-label-demo-basic-example',
  templateUrl: './label-demo-basic-example.component.html',
  styleUrls: ['./label-demo-basic-example.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelDemoBasicExampleComponent {}
