import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CheckboxLabelSize } from '../../../../internal/declarations/types/checkbox-label-size.type';

@Injectable({ providedIn: 'any' })
export class CheckboxService {
  private readonly disabledState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly disabled$: Observable<boolean> = this.disabledState$.asObservable();

  private readonly hoveredState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly hovered$: Observable<boolean> = this.hoveredState$.asObservable();

  private readonly valueState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly value$: Observable<boolean> = this.valueState$.asObservable();

  private readonly indeterminateState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly indeterminate$: Observable<boolean> = this.indeterminateState$.asObservable();

  private readonly withLabelState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly withLabel$: Observable<boolean> = this.withLabelState$.asObservable();

  private readonly errorState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly error$: Observable<boolean> = this.errorState$.asObservable();

  private readonly sizeState$: BehaviorSubject<CheckboxLabelSize> = new BehaviorSubject<CheckboxLabelSize>('medium');
  public readonly size$: Observable<CheckboxLabelSize> = this.sizeState$.asObservable();

  public setDisabled(value: boolean): void {
    this.disabledState$.next(value);
  }

  public setValue(value: boolean): void {
    this.valueState$.next(value);
  }

  public setIndeterminate(value: boolean): void {
    this.indeterminateState$.next(value);
  }

  public setWithLabel(value: boolean): void {
    this.withLabelState$.next(value);
  }

  public setError(value: boolean): void {
    this.errorState$.next(value);
  }

  public setSize(value: CheckboxLabelSize): void {
    this.sizeState$.next(value);
  }

  public setHovered(value: boolean): void {
    this.hoveredState$.next(value);
  }
}
