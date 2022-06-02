import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IconHolderSize } from '@kit/internal/declarations/types/icon-holder-size.type';

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
