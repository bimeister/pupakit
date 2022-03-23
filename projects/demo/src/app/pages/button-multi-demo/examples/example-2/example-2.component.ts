import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ButtonKind } from '@kit/internal/declarations/types/button-kind.type';

@Component({
  selector: 'demo-button-multi-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonMultiExample2Component {
  public readonly kinds: ButtonKind[] = [
    'primary',
    'primary-secondary',
    'primary-subtle',
    'secondary',
    'border',
    'border-contrast',
    'subtle',
    'warning',
    'danger',
    'danger-subtle',
  ];
}
