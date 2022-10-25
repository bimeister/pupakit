import { ChangeDetectionStrategy, Component, HostListener, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ComponentChanges, ComponentChange } from '@bimeister/pupakit.common';
import { filterFalsy, isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { RadioControlSize } from '../../../../declarations/types/radio-control-size.type';
import { RadioGroupDirection } from '../../../../declarations/types/radio-group-direction.type';
import { RadioGroupService } from '../../services/radio-group.service';

@Component({
  selector: 'pupa-radio-control',
  templateUrl: './radio-control.component.html',
  styleUrls: ['./radio-control.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioControlComponent<T> implements OnChanges {
  @Input() private readonly value: T;
  @Input() public tabindex: number = 0;
  @Input() public withLabel: boolean = true;

  public readonly labelSize$: Observable<RadioControlSize> = this.radioGroupService.labelSize$;

  public readonly isSelected$: Observable<boolean> = this.radioGroupService.value$.pipe(
    distinctUntilChanged(),
    map((groupControlValue: T) => groupControlValue === this.value),
    shareReplayWithRefCount()
  );

  public readonly isDisabled$: Observable<boolean> = this.radioGroupService.isDisabled$;

  public readonly directions$: Observable<RadioGroupDirection> = this.radioGroupService.direction$;

  public readonly isWithLabel$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private readonly radioGroupService: RadioGroupService<T>) {}

  @HostListener('click')
  public processClick(): void {
    this.radioGroupService.isDisabled$.pipe(take(1), filterFalsy()).subscribe(() => {
      this.select();
      this.setOnTouch();
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
