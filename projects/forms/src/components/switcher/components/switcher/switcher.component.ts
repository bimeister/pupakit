import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { filterFalsy, filterTruthy, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { map, switchMapTo, take } from 'rxjs/operators';
import { SwitcherSize } from '../../../../declarations/types/switcher-size.type';

@Component({
  selector: 'pupa-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitcherComponent),
      multi: true,
    },
  ],
})
export class SwitcherComponent implements OnChanges, ControlValueAccessor {
  @Input() public disabled: boolean = false;
  @Input() public value: boolean;
  @Input() public tabindex: number = 0;

  @Input() public size: SwitcherSize = 'medium';

  public readonly value$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isDisabled$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);
  public readonly isTouched$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);
  public readonly isFocused$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);

  @Output() public focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() public blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  @Output() public updateValue: EventEmitter<boolean> = new EventEmitter<boolean>();

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.handleDisabledChanges(changes?.disabled);
    this.handleValueChanges(changes?.value);
  }

  public get sizeClass(): string {
    return `switcher_${this.size}`;
  }

  public onKeyDown(_event: MouseEvent): void {
    this.isFocused$.pipe(take(1), filterTruthy()).subscribe(() => this.changeValue());
  }

  public changeValue(): void {
    this.isDisabled$
      .pipe(
        take(1),
        filterFalsy(),
        switchMapTo(this.value$),
        take(1),
        map((value: boolean) => !value)
      )
      .subscribe((updatedValue: boolean) => {
        this.value$.next(updatedValue);
        this.onTouched();
        this.onChange(updatedValue);

        this.updateValue.emit(updatedValue);
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
    this.isDisabled$.next(isDisabled);
  }

  public emitFocusEvent(focusEvent: FocusEvent): void {
    this.isFocused$.next(true);
    this.focus.emit(focusEvent);
  }

  public emitBlurEvent(blurEvent: FocusEvent): void {
    this.isFocused$.next(false);
    this.blur.emit(blurEvent);
  }

  public onChange: CallableFunction = () => {
    // not implemented
  };

  public onTouched: VoidFunction = () => {
    // not implemented
  };

  private handleValueChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.writeValue(updatedValue);
  }

  private handleDisabledChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: Nullable<boolean> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.setDisabledState(updatedValue);
  }
}
