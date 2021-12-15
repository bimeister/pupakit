import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface SelectOption {
  value: number;
  caption: string;
}

const SELECT_OPTIONS: SelectOption[] = [
  { value: 1, caption: 'Report 1' },
  { value: 2, caption: 'Report 2' },
  { value: 3, caption: 'Report 3' },
  { value: 4, caption: 'Report 4' },
  { value: 5, caption: 'Report 5' },
];

@Component({
  selector: 'demo-select-example-13',
  templateUrl: './example-13.component.html',
  styleUrls: ['./example-13.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample13Component {
  public readonly control: FormControl = new FormControl();

  public readonly options$: BehaviorSubject<SelectOption[]> = new BehaviorSubject<SelectOption[]>(SELECT_OPTIONS);

  public readonly selectedValuePreview$: Observable<string> = this.control.valueChanges.pipe(
    startWith(this.control.value),
    map((controlValue: number) => SELECT_OPTIONS.find((option: SelectOption) => option.value === controlValue)),
    map((selectedOption: SelectOption) => selectedOption?.caption ?? '')
  );

  public search(query: string): void {
    const updatedOptions: SelectOption[] = SELECT_OPTIONS.filter((option: SelectOption) =>
      option.caption.toLowerCase().includes(query.toLowerCase())
    );
    this.options$.next(updatedOptions);
  }
}
