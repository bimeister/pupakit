import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

interface SelectOption {
  value: string;
  caption: string;
}

const SELECT_OPTIONS: SelectOption[] = [
  { value: 'Value 1', caption: 'Report 1' },
  { value: 'Value 2', caption: 'Report 2' },
  { value: 'Value 3', caption: 'Report 3' },
  { value: 'Value 4', caption: 'Report 4' },
  { value: 'Value 5', caption: 'Report 5' },
  { value: 'Value 6', caption: 'Report 6' },
  { value: 'Value 7', caption: 'Report 7' },
];

@Component({
  selector: 'demo-tag-example-6',
  templateUrl: './example-6.component.html',
  styleUrls: ['./example-6.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagExample6Component {
  public readonly control1: FormControl<string> = new FormControl<string>(SELECT_OPTIONS[0].value);
  public readonly control2: FormControl<string> = new FormControl<string>(SELECT_OPTIONS[1].value);
  public readonly control3: FormControl<string> = new FormControl<string>(SELECT_OPTIONS[2].value);
  public readonly control4: FormControl<string> = new FormControl<string>(SELECT_OPTIONS[3].value);
  public readonly control5: FormControl<string> = new FormControl<string>(SELECT_OPTIONS[4].value);
  public readonly control6: FormControl<string> = new FormControl<string>(SELECT_OPTIONS[5].value);
  public readonly control7: FormControl<string> = new FormControl<string>(SELECT_OPTIONS[6].value);
  public readonly options$: BehaviorSubject<SelectOption[]> = new BehaviorSubject<SelectOption[]>(SELECT_OPTIONS);
}
