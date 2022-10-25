import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ButtonMultiKind } from '@bimeister/pupakit.kit';

@Component({
  selector: 'demo-button-multi-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonMultiExample2Component {
  public readonly kinds: ButtonMultiKind[] = ['primary', 'border', 'success', 'warning', 'danger'];
}
