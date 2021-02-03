import { Directive, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { isDate } from '../../../helpers/is-date.helper';
import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { InputSize } from '../../types/input-size.type';
import { InputBaseControlValueAccessor } from './input-base-control-value-accessor.abstract';

@Directive()
export abstract class InputBase<T> extends InputBaseControlValueAccessor<T> implements OnChanges {
  @Input() public readonly size: InputSize = 'medium';
  public readonly size$: BehaviorSubject<InputSize> = new BehaviorSubject<InputSize>('medium');

  @Input() public readonly transparent: boolean = false;
  public readonly transparent$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly placeholder: string = '';
  public readonly placeholder$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Input() public readonly autocomplete: boolean = false;
  public readonly autocomplete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() public focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() public blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processSizeChange(changes?.size);
    this.processTransparentChange(changes?.transparent);
    this.processPlaceholderChange(changes?.placeholder);
    this.processAutocompleteChange(changes?.autocomplete);
  }

  public emitFocusEvent(focusEvent: FocusEvent): void {
    this.isFocused$.next(true);
    this.focus.emit(focusEvent);
  }

  public emitBlurEvent(blurEvent: FocusEvent): void {
    this.isFocused$.next(false);
    this.blur.emit(blurEvent);
  }

  public isDate(value: unknown): boolean {
    return isDate(value);
  }

  private processSizeChange(change: ComponentChange<this, InputSize>): void {
    const updatedValue: InputSize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.size$.next(updatedValue);
  }

  private processTransparentChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.transparent$.next(updatedValue);
  }

  private processPlaceholderChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.placeholder$.next(updatedValue);
  }

  private processAutocompleteChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.autocomplete$.next(updatedValue);
  }
}
