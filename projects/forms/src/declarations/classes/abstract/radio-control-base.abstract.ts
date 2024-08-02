import { Directive, HostListener, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { RadioControlSize } from '../../types/radio-control-size.type';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { filterFalsy, isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { RadioGroupService } from '../../../components/radio-group/services/radio-group.service';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';

@Directive()
export abstract class RadioControlBase<T> implements OnChanges, OnInit, OnDestroy {
  @Input() public value: T;
  @Input() public tabindex: number = 0;
  @Input() public withLabel: boolean = true;
  @Input() public disabled: boolean = false;

  public readonly labelSize$: Observable<RadioControlSize> = this.radioGroupService.labelSize$;

  public readonly isSelected$: Observable<boolean> = this.radioGroupService.value$.pipe(
    distinctUntilChanged(),
    map((groupControlValue: T) => groupControlValue === this.value),
    shareReplayWithRefCount()
  );

  protected readonly isWithLabel$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public readonly isGroupDisabled$: Observable<boolean> = this.radioGroupService.isDisabled$;

  protected readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly radioGroupService: RadioGroupService<T>) {}

  @HostListener('click')
  public processClick(): void {
    this.isDisabled$.pipe(take(1), filterFalsy()).subscribe(() => {
      this.setOnTouch();
      this.select();
    });
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processWithLabelChange(changes?.withLabel);
    this.processDisabledChange(changes?.disabled);
  }

  public ngOnInit(): void {
    this.subscription.add(this.toggleAvailabilityOnGroupAvailabilityChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private select(): void {
    this.radioGroupService.setValue(this.value);
  }

  private setOnTouch(): void {
    this.radioGroupService.setOnTouch(true);
  }

  private processWithLabelChange(change: ComponentChange<this, boolean> | undefined): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isWithLabel$.next(updatedValue);
  }

  private processDisabledChange(change: ComponentChange<this, boolean> | undefined): void {
    this.isGroupDisabled$
      .pipe(
        take(1),
        filter((isGroupDisabled: boolean) => !isGroupDisabled && !isNil(change?.currentValue))
      )
      .subscribe(() => {
        this.isDisabled$.next(change.currentValue);
      });
  }

  private toggleAvailabilityOnGroupAvailabilityChanges(): Subscription {
    return this.isGroupDisabled$.pipe(distinctUntilChanged()).subscribe((isGroupDisabled: boolean) => {
      this.isDisabled$.next(isGroupDisabled || this.disabled);
    });
  }
}
