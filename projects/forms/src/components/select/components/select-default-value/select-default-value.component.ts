import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { SelectStateService } from '../../services/select-state.service';
import { map } from 'rxjs/operators';
import { isEmpty, isNil } from '@bimeister/utilities';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'pupa-select-default-value',
  templateUrl: './select-default-value.component.html',
  styleUrls: ['./select-default-value.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDefaultValueComponent<T> {
  public readonly isSelectEmpty$: Observable<boolean> = combineLatest([
    this.selectStateService.currentValue$,
    this.selectStateService.defaultValue$,
  ]).pipe(
    map(
      ([currentValue, defaultValue]: [T[], T]) =>
        currentValue.every((value: T) => isNil(value) || value === defaultValue) || isEmpty(currentValue)
    )
  );

  constructor(protected readonly selectStateService: SelectStateService<T>) {}

  public resetToDefaultValue(): void {
    this.selectStateService.reset();
    this.selectStateService.collapse();
  }
}
