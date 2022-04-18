import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChipColors } from '@kit/internal/declarations/enums/chip-colors.enum';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

@Component({
  selector: 'demo-chip',
  templateUrl: './chip-demo.component.html',
  styleUrls: ['./chip-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipDemoComponent {
  public readonly colorOptions: PropsOption[] = Object.values(ChipColors).map((value: string) => ({
    caption: value,
    value,
  }));
}
