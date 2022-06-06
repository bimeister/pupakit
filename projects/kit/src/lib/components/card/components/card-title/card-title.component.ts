import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

type MaxRows = number | 'auto';
type LineClamp = number | 'none';

const DEFAULT_MAX_ROWS: MaxRows = 1;

@Component({
  selector: 'pupa-card-title',
  templateUrl: './card-title.component.html',
  styleUrls: ['./card-title.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTitleComponent implements OnChanges {
  @Input() public maxRows: MaxRows = DEFAULT_MAX_ROWS;
  private readonly maxRows$: BehaviorSubject<MaxRows> = new BehaviorSubject<MaxRows>(DEFAULT_MAX_ROWS);

  public readonly lineClamp$: Observable<LineClamp> = this.maxRows$.pipe(
    distinctUntilChanged(),
    map((maxRows: MaxRows) => (maxRows === 'auto' ? 'none' : maxRows))
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processMaxRowsChange(changes?.maxRows);
  }

  private processMaxRowsChange(change: ComponentChange<this, MaxRows>): void {
    const updatedValue: MaxRows | undefined = change?.currentValue;

    const isValidValue: boolean = updatedValue === 'auto' || (typeof updatedValue === 'number' && !isNaN(updatedValue));

    if (!isValidValue) {
      return;
    }

    this.maxRows$.next(updatedValue);
  }
}
