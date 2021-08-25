import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChipColors } from '../../../../src/public-api';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';

@Component({
  selector: 'demo-chip',
  templateUrl: './chip-demo.component.html',
  styleUrls: ['./chip-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipDemoComponent {
  public readonly colorOptions: RadioOption[] = Object.values(ChipColors).map((value: string) => ({
    caption: value,
    value
  }));
}
