import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { MaskitoOptions } from '@maskito/core';
import { filter, take } from 'rxjs/operators';
import { InputBase } from '../../../../declarations/classes/abstract/input-base.abstract';
import { ValueType } from '../../../../declarations/types/input-value.type';

const DEFAULT_VALUE: string = '';

@Component({
  selector: 'pupa-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent extends InputBase<ValueType> {
  public readonly maskitoOptions: MaskitoOptions = {
    mask: /^-?\d*\.?\d*$/,
  };

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? DEFAULT_VALUE : String(value);

    this.value$.next(serializedValue);
  }

  public convertValue(value: string | undefined | null): string {
    const filteredString: string = value.replace(/[^0-9\-.]/g, DEFAULT_VALUE);

    const dotIndex: number = filteredString.indexOf('.');
    const minusIndex: number = filteredString.indexOf('-');

    if (dotIndex !== -1 && filteredString.indexOf('.', dotIndex + 1) !== -1) {
      return filteredString.slice(0, dotIndex + 1) + filteredString.slice(dotIndex + 1).replace(/\./g, DEFAULT_VALUE);
    }

    if (minusIndex > 0) {
      return filteredString.slice(0, minusIndex) + filteredString.slice(minusIndex).replace(/-/g, DEFAULT_VALUE);
    }

    return filteredString;
  }

  public reset(): void {
    this.updateValue(DEFAULT_VALUE);
    this.inputElementRef.nativeElement.value = DEFAULT_VALUE;
    this.inputElementRef.nativeElement.focus();
  }

  public emitFocusEvent(focusEvent: FocusEvent): void {
    this.handleFocusOrBlurEvent(true, focusEvent);
  }

  public emitBlurEvent(blurEvent: FocusEvent): void {
    this.handleFocusOrBlurEvent(false, blurEvent);
  }

  public updateValue(updatedValue: ValueType): void {
    this.value$
      .pipe(
        take(1),
        filter((value: ValueType) => value !== updatedValue)
      )
      .subscribe(() => super.updateValue(updatedValue));
  }

  private handleFocusOrBlurEvent(isFocused: boolean, event: FocusEvent): void {
    const serializedValue: string = this.convertValue(this.inputElementRef.nativeElement.value);
    this.value$.pipe(take(1)).subscribe(() => {
      this.updateValue(serializedValue);
      this.inputElementRef.nativeElement.value = serializedValue;
      this.isFocused$.next(isFocused);
      isFocused ? this.focus.emit(event) : this.blur.emit(event);
    });
  }
}
