import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SelectOption } from '../../../../src/internal/declarations/interfaces/select-option.interface';

@Component({
  selector: 'demo-select-multiple',
  templateUrl: './select-multiple-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectMultipleDemoComponent {
  public options: SelectOption[] = [
    {
      value: '1',
      caption: '1abcdefg'
    },
    {
      value: '2',
      caption: '2a'
    },
    {
      value: '3',
      caption: '3'
    },
    {
      value: '4',
      caption: '4ab'
    },
    {
      value: '5',
      caption: '5 какой-то текст длинный очень просто жесть какой длинный словами не описать'
    },
    {
      value: '6',
      caption: '6'
    },
    {
      value: '7',
      caption: '7'
    }
  ];
}
