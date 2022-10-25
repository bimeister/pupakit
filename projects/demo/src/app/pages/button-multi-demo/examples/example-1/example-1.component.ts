import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ButtonMultiKind } from '@bimeister/pupakit.kit';

@Component({
  selector: 'demo-button-multi-example-1',
  templateUrl: './example-1.component.html',
  styleUrls: ['./example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonMultiExample1Component {
  public readonly kinds: ButtonMultiKind[] = ['primary', 'border', 'success', 'warning', 'danger'];
}
