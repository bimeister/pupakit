import { Directive, HostListener, Input, OnChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RadioControlSize } from '../../types/radio-control-size.type';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { filterFalsy, isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { RadioGroupService } from '../../../components/radio-group/services/radio-group.service';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';

@Directive()
export abstract class RadioControlBase<T> implements OnChanges {
  @Input() public value: T;
  @Input() public tabindex: number = 0;
  @Input() public withLabel: boolean = true;

  public readonly labelSize$: Observable<RadioControlSize> = this.radioGroupService.labelSize$;

  public readonly isSelected$: Observable<boolean> = this.radioGroupService.value$.pipe(
    distinctUntilChanged(),
    map((groupControlValue: T) => groupControlValue === this.value),
    shareReplayWithRefCount()
  );

  public readonly isDisabled$: Observable<boolean> = this.radioGroupService.isDisabled$;

  public readonly isWithLabel$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private readonly radioGroupService: RadioGroupService<T>) {}

  @HostListener('click')
  public processClick(): void {
    this.radioGroupService.isDisabled$.pipe(take(1), filterFalsy()).subscribe(() => {
      this.setOnTouch();
      this.select();
    });
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processWithLabelChange(changes?.withLabel);
  }

  private select(): void {
    this.radioGroupService.setValue(this.value);
  }

  private setOnTouch(): void {
    this.radioGroupService.setOnTouch(true);
  }

  private processWithLabelChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isWithLabel$.next(updatedValue);
  }
}
