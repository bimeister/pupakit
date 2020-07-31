import {
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { isNil } from '@meistersoft/utilities';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { VOID } from '../../../../../internal/constants/void.const';
import { RadioGroupDirection } from '../../../../../internal/declarations/types/radio-group-direction.type';

type OnChangeCallback<T> = (value: T) => void;
type OnTouchedCallback = VoidFunction;

@Component({
  selector: 'pupa-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioGroupComponent<T> implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly internalControl: FormControl = new FormControl();
  public readonly direction: RadioGroupDirection;

  constructor(
    @Attribute('direction') direction: RadioGroupDirection = 'column',
    private readonly ngControl: NgControl,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    if (isNil(ngControl)) {
      throw new Error('NgControl passed to RadioGroupComponent is undefined');
    }
    this.ngControl.valueAccessor = this;

    this.direction = direction;
  }

  public ngOnInit(): void {
    this.subscription.add(this.triggerCallBackOnChange());
  }

  public ngAfterViewInit(): void {
    this.writeValue(this.ngControl.value);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public writeValue(value: T): void {
    this.internalControl.setValue(value, {
      emitEvent: true
    });

    this.triggerChangeDetector();
  }

  public registerOnChange(onChange: OnChangeCallback<T>): void {
    this.onChange = onChange;
  }
  public registerOnTouched(onTouched: OnTouchedCallback): void {
    this.onTouched = onTouched;
  }
  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.internalControl.disable();
      return;
    }
    this.internalControl.enable();
  }

  public onTouched: OnTouchedCallback = () => VOID;
  private onChange: OnChangeCallback<T> = () => VOID;

  private triggerCallBackOnChange(): Subscription {
    return this.internalControl.valueChanges.pipe().subscribe((value: T) => this.onChange(value));
  }

  private triggerChangeDetector(): void {
    timer()
      .pipe(take(1))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });
  }
}
