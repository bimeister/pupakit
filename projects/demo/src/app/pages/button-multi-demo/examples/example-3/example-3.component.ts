import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ButtonKind } from '@kit/internal/declarations/types/button-kind.type';
import { ButtonSize } from '@kit/internal/declarations/types/button-size.type';

@Component({
  selector: 'demo-button-multi-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonMultiExample3Component {
  public readonly kinds: ButtonKind[] = ['primary', 'primary-secondary', 'secondary', 'warning', 'danger'];

  public readonly sizes: ButtonSize[] = ['small', 'medium', 'large'];
}
