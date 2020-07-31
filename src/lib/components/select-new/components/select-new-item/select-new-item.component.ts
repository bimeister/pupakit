import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { SelectNewStateService } from '../../services/select-new-state.service';

@Component({
  selector: 'pupa-select-new-item',
  templateUrl: './select-new-item.component.html',
  styleUrls: ['./select-new-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectNewItemComponent<T> implements OnChanges {
  @Input() public value: T = null;
  private readonly value$: BehaviorSubject<T> = new BehaviorSubject<T>(this.value);

  public readonly isPicked$: Observable<boolean> = this.value$.pipe(
    switchMap((value: T) => this.selectNewStateService.isPicked(value)),
    distinctUntilChanged()
  );

  public readonly isDisabled$: Observable<boolean> = this.selectNewStateService.isDisabled$;

  constructor(private readonly selectNewStateService: SelectNewStateService<T>) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processValueChange(changes?.value);
  }

  public processClick(): void {
    this.value$
      .pipe(
        withLatestFrom(this.isDisabled$),
        take(1),
        filter(([_, isDisabled]: [T, boolean]) => !isDisabled),
        map(([value, _]: [T, boolean]) => value)
      )
      .subscribe((value: T) => {
        this.selectNewStateService.processSelection(value);
      });
  }

  private processValueChange(change: ComponentChange<this, T>): void {
    const updatedValue: T | undefined = change?.currentValue;
    this.value$.next(updatedValue);
  }
}
