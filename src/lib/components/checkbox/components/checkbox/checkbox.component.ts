import { ChangeDetectionStrategy, Component, forwardRef, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filterFalsy, filterTruthy, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, switchMapTo, take } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { CheckboxService } from '../../services/checkbox.service';

@Component({
  selector: 'pupa-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    CheckboxService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements ControlValueAccessor, OnChanges {
  @Input() public disabled: boolean = false;
  @Input() public indeterminate: boolean = false;
  @Input() public inversion: boolean = false;
  @Input() public value: boolean;

  private readonly disabled$: BehaviorSubject<boolean> = this.checkboxService.disabled$;
  private readonly value$: BehaviorSubject<boolean> = this.checkboxService.value$;
  private readonly indeterminate$: BehaviorSubject<boolean> = this.checkboxService.indeterminate$;
  private readonly inversion$: BehaviorSubject<boolean> = this.checkboxService.inversion$;
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly checkboxService: CheckboxService) {
    this.subscription.add(this.processSetIndeterminate());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.handleIndeterminateChanges(changes?.indeterminate);
    this.handleDisabledChanges(changes?.disabled);
    this.handleValueChanges(changes?.value);
    this.handleInversionChanges(changes?.inversion);
  }

  public changeValue(): void {
    this.disabled$
      .pipe(
        take(1),
        filterFalsy(),
        switchMapTo(this.value$),
        take(1),
        map((value: boolean) => !value)
      )
      .subscribe((value: boolean) => {
        this.value$.next(value);
        this.indeterminate$.next(false);
        this.onTouched();
        this.onChange(value);
      });
  }

  public registerOnChange(onChangeCallback: VoidFunction): void {
    this.onChange = onChangeCallback;
  }

  public registerOnTouched(onTouchedCallback: VoidFunction): void {
    this.onTouched = onTouchedCallback;
  }

  public writeValue(value: boolean): void {
    this.value$.next(value);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled$.next(isDisabled);
  }

  public onChange: CallableFunction = (_innerValue: string) => {
    return;
  };

  public onTouched: VoidFunction = () => {
    return;
  };

  private handleValueChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.value$.next(updatedValue);
  }

  private handleIndeterminateChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.indeterminate$.next(updatedValue);
  }

  private handleDisabledChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.disabled$.next(updatedValue);
  }

  private handleInversionChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.inversion$.next(updatedValue);
  }

  private processSetIndeterminate(): Subscription {
    return this.indeterminate$.pipe(filterTruthy()).subscribe(() => this.value$.next(null));
  }
}
