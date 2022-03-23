import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HorizontalConnectionPos } from '@angular/cdk/overlay';

@Component({
  selector: 'demo-button-multi-example-5',
  templateUrl: './example-5.component.html',
  styleUrls: ['./example-5.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonMultiExample5Component {
  public readonly horizontalConnectionPositions: HorizontalConnectionPos[] = ['start', 'center', 'end'];
}
