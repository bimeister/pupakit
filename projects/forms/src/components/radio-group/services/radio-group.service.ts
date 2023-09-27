import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RadioControlSize } from '../../../declarations/types/radio-control-size.type';

@Injectable()
export class RadioGroupService<T> {
  private readonly valueState$: BehaviorSubject<T> = new BehaviorSubject<T>(null);
  public readonly value$: Observable<T> = this.valueState$.asObservable();

  private readonly onTouchState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly onTouch$: Observable<boolean> = this.onTouchState$.asObservable();

  private readonly isDisabledState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isDisabled$: Observable<boolean> = this.isDisabledState$.asObservable();

  private readonly labelSizeState$: BehaviorSubject<RadioControlSize> = new BehaviorSubject<RadioControlSize>('medium');
  public readonly labelSize$: Observable<RadioControlSize> = this.labelSizeState$.asObservable();

  public setValue(value: T): void {
    this.valueState$.next(value);
  }

  public setOnTouch(value: boolean): void {
    this.onTouchState$.next(value);
  }

  public setDisabled(value: boolean): void {
    this.isDisabledState$.next(value);
  }

  public setLabelSize(value: RadioControlSize): void {
    this.labelSizeState$.next(value);
  }
}
