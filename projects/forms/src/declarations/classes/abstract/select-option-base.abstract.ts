import { Directive, HostListener, OnChanges } from '@angular/core';
import { ComponentChanges, ComponentChange } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { SelectStateServiceDeclaration } from '../../interfaces/select-state-service-declaration.interface';

@Directive()
export abstract class SelectOptionBase<T> implements OnChanges {
  public abstract value: T;
  public abstract isDisabled: boolean;

  private readonly value$: BehaviorSubject<T> = new BehaviorSubject<T>(null);

  public readonly isHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly isPicked$: Observable<boolean> = this.value$.pipe(
    switchMap((value: T) => this.selectStateService.isPicked(value)),
    distinctUntilChanged()
  );

  private readonly isSelfDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly isDisabled$: Observable<boolean> = combineLatest([
    this.isSelfDisabled$,
    this.selectStateService.isDisabled$,
  ]).pipe(map(([isSelfDisabled, isDisabled]: [boolean, boolean]) => isSelfDisabled || isDisabled));

  constructor(protected readonly selectStateService: SelectStateServiceDeclaration<T>) {}

  @HostListener('mouseover')
  public processMouseOver(): void {
    this.isHovered$.next(true);
  }

  @HostListener('mouseleave')
  public processMouseLeave(): void {
    this.isHovered$.next(false);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }

    if (changes.hasOwnProperty('value')) {
      this.processValueChange(changes.value);
    }

    if (changes.hasOwnProperty('isDisabled')) {
      this.processIsDisabledChange(changes.isDisabled);
    }
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
        this.selectStateService.processSelection(value);
      });
  }

  private processValueChange(change: ComponentChange<this, T>): void {
    const updatedValue: T | undefined = change?.currentValue;
    this.value$.next(updatedValue);
  }

  private processIsDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;
    this.isSelfDisabled$.next(updatedValue);
  }
}
