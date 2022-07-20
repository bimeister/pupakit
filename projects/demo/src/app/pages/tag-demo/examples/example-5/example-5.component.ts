import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

interface SelectOption {
  value: string;
  caption: string;
}

const SELECT_OPTIONS: SelectOption[] = [
  { value: 'value text 1', caption: 'Report 1' },
  { value: 'value text 2', caption: 'Report 2' },
  { value: 'value text 3', caption: 'Report 3' },
  { value: 'value text 4', caption: 'Report 4' },
  { value: 'value text 5', caption: 'Report 5' },
];
@Component({
  selector: 'demo-tag-example-5',
  templateUrl: './example-5.component.html',
  styleUrls: ['./example-5.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagExample5Component {
  public readonly control: FormControl = new FormControl(SELECT_OPTIONS[0].value);
  public readonly options$: BehaviorSubject<SelectOption[]> = new BehaviorSubject<SelectOption[]>(SELECT_OPTIONS);
}
