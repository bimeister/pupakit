import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IconHolderSize } from '@bimeister/pupakit.kit';

@Component({
  selector: 'demo-example-1',
  templateUrl: './example-1.component.html',
  styleUrls: ['./example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example1Component {
  public readonly sizes: IconHolderSize[] = ['large', 'medium', 'small', 'extra-small'];
}
