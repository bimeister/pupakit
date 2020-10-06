import { Directive, OnChanges } from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { SelectStateService } from '../../interfaces/select-state-service.interface';

@Directive()
export abstract class SelectItemBase<T> implements OnChanges {
  public abstract value: T;

  private readonly value$: BehaviorSubject<T> = new BehaviorSubject<T>(null);

  public readonly isPicked$: Observable<boolean> = this.value$.pipe(
    switchMap((value: T) => this.selectNewStateService.isPicked(value)),
    distinctUntilChanged()
  );

  public readonly isDisabled$: Observable<boolean> = this.selectNewStateService.isDisabled$;

  constructor(private readonly selectNewStateService: SelectStateService<T>) {}

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
