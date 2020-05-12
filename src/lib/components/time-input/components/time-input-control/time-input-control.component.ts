import { Component, OnInit, ChangeDetectionStrategy, Host, OnDestroy, Optional } from '@angular/core';
import { TimeInputComponent } from '../time-input/time-input.component';
import { FormArray, FormControl, NgControl, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pupa-time-input-control',
  templateUrl: './time-input-control.component.html',
  styleUrls: ['./time-input-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeInputControlComponent implements OnInit, OnDestroy, ControlValueAccessor {
  public readonly internalControl: FormControl = new FormControl('');
  public isDisabled: boolean = false;

  private readonly parentFormArray: FormArray = this.parentComponent.internalArray;
  private readonly subscription: Subscription = new Subscription();

  constructor(@Host() public readonly parentComponent: TimeInputComponent, @Optional() readonly ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  public ngOnInit(): void {
    this.parentFormArray.push(this.internalControl);

    this.subscription
      .add(this.updateFormattingByOuterChanges())
      .add(this.updateDisabledState())
      .add(this.updateValueChange());
  }
  public ngOnDestroy(): void {
    this.removeSelfFromParent();
    this.subscription.unsubscribe();
  }
  public onUserUnfocus(): void {
    this.internalControl.setValue(this.formatUnityHeadingZero(this.internalControl.value), { emitEvent: false });
  }

  public writeValue(value: string): void {
    this.internalControl.setValue(value);
  }
  public registerOnChange(fn: any): void {
    this.onChage = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public onChage: (value: string) => void = () => {
    return;
  };
  public onTouch: VoidFunction = () => {
    return;
  };

  private updateFormattingByOuterChanges(): Subscription {
    return this.internalControl.valueChanges.subscribe(value => {
      this.internalControl.setValue(this.formatZerosInsteadEmptyUnit(value), { emitEvent: false });
    });
  }
  private updateDisabledState(): Subscription {
    return this.parentComponent.isDisabled$.subscribe((disabled: boolean) => {
      this.isDisabled = disabled;
    });
  }
  private updateValueChange(): Subscription {
    return this.internalControl.valueChanges.subscribe((value: string) => {
      if (this.internalControl.disabled) {
        return;
      }

      this.onTouch();
      this.onChage(value);
    });
  }

  private removeSelfFromParent(): void {
    const controlIndex: number = this.parentFormArray.controls.indexOf(this.internalControl);
    this.parentFormArray.removeAt(controlIndex);
  }
  private formatZerosInsteadEmptyUnit(unit: string): string {
    if (unit.length === 0) {
      return '00';
    }

    return unit;
  }
  private formatUnityHeadingZero(unit: string): string {
    if (unit.length === 1) {
      return `0${unit}`;
    }

    return unit;
  }
}
