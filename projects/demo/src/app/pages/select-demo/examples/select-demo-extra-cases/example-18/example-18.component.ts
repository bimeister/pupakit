import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  selector: 'demo-select-example-18',
  templateUrl: './example-18.component.html',
  styleUrls: ['./example-18.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample18Component {
  public readonly control: FormControl = new FormControl(SELECT_OPTIONS[0].value);

  public readonly options$: BehaviorSubject<SelectOption[]> = new BehaviorSubject<SelectOption[]>(SELECT_OPTIONS);

  public readonly selectedValuePreview$: Observable<string> = this.control.valueChanges.pipe(
    startWith(this.control.value),
    map((controlValue: string) => SELECT_OPTIONS.find((option: SelectOption) => option.value === controlValue)),
    map((selectedOption: SelectOption) => selectedOption?.caption ?? '')
  );

  public search(query: string): void {
    const updatedOptions: SelectOption[] = SELECT_OPTIONS.filter((option: SelectOption) =>
      option.caption.toLowerCase().includes(query.toLowerCase())
    );
    this.options$.next(updatedOptions);
  }
}
