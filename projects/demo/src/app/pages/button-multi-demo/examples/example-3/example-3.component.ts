import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ButtonSize } from '@bimeister/pupakit.kit';

@Component({
  selector: 'demo-button-multi-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonMultiExample3Component {
  public readonly sizes: ButtonSize[] = ['xl', 'l', 'm', 's', 'xs'];
}
