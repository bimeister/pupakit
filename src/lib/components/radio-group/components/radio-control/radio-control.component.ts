import { ChangeDetectionStrategy, Component, Host, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';

import { RadioGroupComponent } from '../radio-group/api';

/** @dynamic */
@Component({
  selector: 'pupa-radio-control',
  templateUrl: './radio-control.component.html',
  styleUrls: ['./radio-control.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioControlComponent<T> {
  private readonly groupControl: FormControl = this.radioGroupComponent.internalControl;

  @Input() private readonly value: T;

  private readonly groupControlValue$: Observable<T> = this.groupControl.valueChanges.pipe(
    startWith(this.groupControl.value),
    distinctUntilChanged(),
    shareReplay(1)
  );
  public readonly isSelected$: Observable<boolean> = this.groupControlValue$.pipe(
    map((groupControlValue: T) => groupControlValue === this.value),
    shareReplay(1)
  );

  private readonly groupControlStatus$: Observable<string> = this.groupControl.statusChanges.pipe(
    map(() => this.groupControl.status),
    startWith(this.groupControl.status),
    distinctUntilChanged(),
    shareReplay(1)
  );
  public readonly isDisabled$: Observable<boolean> = this.groupControlStatus$.pipe(
    map(() => this.groupControl.disabled)
  );

  public readonly isTouched$: Observable<boolean> = this.groupControlValue$.pipe(map(() => this.groupControl.touched));
  public readonly isHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Host() private readonly radioGroupComponent: RadioGroupComponent<T>) {}

  @HostListener('click')
  public processClick(): void {
    if (this.groupControl.disabled) {
      return;
    }

    this.select();
    this.radioGroupComponent.onTouched();
  }

  public select(): void {
    this.radioGroupComponent.writeValue(this.value);
  }

  public markAsHovered(): void {
    this.isHovered$.next(true);
  }

  public markAsBlured(): void {
    this.isHovered$.next(false);
  }
}
