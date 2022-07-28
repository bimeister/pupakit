import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ButtonKind } from '@kit/internal/declarations/types/button-kind.type';

@Component({
  selector: 'demo-button-multi-example-1',
  templateUrl: './example-1.component.html',
  styleUrls: ['./example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonMultiExample1Component {
  public readonly kinds: ButtonKind[] = ['primary', 'secondary', 'border', 'success', 'warning', 'danger'];
}
