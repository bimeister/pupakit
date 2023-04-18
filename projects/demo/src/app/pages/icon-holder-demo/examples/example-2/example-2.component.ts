import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IconHolderKind } from '@bimeister/pupakit.kit/declarations/types/icon-holder-kind.type';

@Component({
  selector: 'demo-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example2Component {
  public readonly kinds: IconHolderKind[] = [
    'danger',
    'neutral',
    'opacity',
    'primary',
    'success',
    'warning',
    'disabled',
  ];
}
