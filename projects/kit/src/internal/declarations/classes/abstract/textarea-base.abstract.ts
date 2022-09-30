import { Directive, ElementRef, EventEmitter, Input, OnChanges, Optional, Output, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  distinctUntilSerializedChanged,
  filterNotNil,
  filterTruthy,
  isNil,
  Nullable,
  shareReplayWithRefCount,
} from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { TextAreaCounterVisibility } from '../../../../internal/declarations/types/text-area-counter-visibility-mode.type';
import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { TextareaSize } from '../../types/textarea-size.type';
import { InputBaseControlValueAccessor } from './input-base-control-value-accessor.abstract';

const DEFAULT_MAX_ROWS: number = 5;
const LARGE_TEXTAREA_VERTICAL_PADDINGS_PX: number = 24;
const MEDIUM_TEXTAREA_VERTICAL_PADDINGS_PX: number = 16;

@Directive()
export abstract class TextareaBase extends InputBaseControlValueAccessor<string> implements OnChanges {
  @ViewChild('lineHeightSource', { static: true })
  protected readonly lineHeightSourceRef: ElementRef<HTMLTextAreaElement>;

  @ViewChild('textarea')
  protected readonly textareaElementRef: ElementRef<HTMLTextAreaElement>;

  @Input() public size: TextareaSize = 'medium';
  public readonly size$: BehaviorSubject<TextareaSize> = new BehaviorSubject<TextareaSize>('medium');

  @Input() public readonly placeholder: string = '';
  public readonly placeholder$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Input() public readonly autocomplete: boolean = false;
  public readonly autocomplete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly isPatched: boolean = false;
  public readonly isPatched$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public minRows: number = 2;
  private readonly minRows$: BehaviorSubject<number> = new BehaviorSubject<number>(this.minRows);
  public readonly minHeightPx$: Observable<number> = combineLatest([this.minRows$, this.size$]).pipe(
    map(([minRows, size]: [number, TextareaSize]) =>
      TextareaBase.getHeightPxByRowsCount(this.lineHeightSourceRef, minRows, size)
    )
  );

  @Input() public maxRows: number = DEFAULT_MAX_ROWS;
  private readonly maxRows$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(this.maxRows);
  public readonly maxHeightPx$: Observable<Nullable<number>> = combineLatest([
    this.minRows$,
    this.maxRows$,
    this.size$,
  ]).pipe(
    map(([minRows, maxRows, size]: [number, Nullable<number>, TextareaSize]) => {
      if (isNil(maxRows)) {
        return null;
      }

      const rowsCount: number = minRows > maxRows ? minRows : maxRows;
      return TextareaBase.getHeightPxByRowsCount(this.lineHeightSourceRef, rowsCount, size);
    })
  );

  @Input() public maxLength: Nullable<number> = null;
  public readonly maxLength$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);

  @Input() public counterVisibility: TextAreaCounterVisibility = 'always';
  public readonly counterVisibility$: BehaviorSubject<TextAreaCounterVisibility> =
    new BehaviorSubject<TextAreaCounterVisibility>('always');

  @Output() private readonly focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() private readonly blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  @Input() public enterKeyPrevented: boolean = false;
  public readonly enterKeyPrevented$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly isInvalid$: Observable<boolean> = combineLatest([
    this.isDisabled$,
    this.isPatched$,
    this.isValid$,
    this.isTouched$,
  ]).pipe(
    distinctUntilSerializedChanged(),
    map(
      ([isDisabled, isPatched, isValid, isTouched]: [boolean, boolean, boolean, boolean]) =>
        (isTouched || isPatched) && !isValid && !isDisabled
    )
  );

  private readonly valueLength$: Observable<number> = this.value$.pipe(
    filterNotNil(),
    map((currentValue: string) => currentValue?.length ?? 0)
  );

  public readonly counterValue$: Observable<string> = combineLatest([this.maxLength$, this.valueLength$]).pipe(
    map(([maxLength, valueLength]: [number, number]) => `${valueLength}/${maxLength}`)
  );

  public readonly isCounterVisible$: Observable<boolean> = combineLatest([
    this.counterVisibility$,
    this.isFocused$,
    this.valueLength$,
  ]).pipe(
    map(([counterVisibilityMode, isFocused, valueLength]: [TextAreaCounterVisibility, boolean, number]) => {
      if (counterVisibilityMode === 'onfocus') {
        return isFocused;
      }

      if (counterVisibilityMode === 'filled') {
        return valueLength > 0;
      }

      return true;
    }),
    distinctUntilChanged(),
    shareReplayWithRefCount()
  );

  constructor(@Optional() ngControl: NgControl) {
    super(ngControl);
  }

  protected setValue(value: Nullable<string>): void {
    const serializedValue: string = isNil(value) ? '' : value;
    this.value$.next(serializedValue);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processSizeChange(changes?.size);
    this.processPlaceholderChange(changes?.placeholder);
    this.processAutocompleteChange(changes?.autocomplete);
    this.processIsPatchedChange(changes?.isPatched);

    this.processMaxLengthChange(changes?.maxLength);
    this.processMaxRowsChange(changes?.maxRows);
    this.processMinRowsChange(changes?.minRows);
    this.processCounterVisibilityChange(changes?.counterVisibility);
    this.processEnterKeyDisabledChange(changes?.enterKeyPrevented);
  }

  public emitFocusEvent(focusEvent: FocusEvent): void {
    this.isFocused$.next(true);
    this.focus.emit(focusEvent);
  }

  public emitBlurEvent(blurEvent: FocusEvent): void {
    this.isFocused$.next(false);
    this.blur.emit(blurEvent);
  }

  public preventEnterKeyEvent(event: MouseEvent): void {
    this.enterKeyPrevented$.pipe(take(1), filterTruthy()).subscribe(() => event.preventDefault());
  }

  public focusOnTextareaElement(): void {
    const textareaElement: HTMLTextAreaElement = this.textareaElementRef.nativeElement;
    textareaElement.focus();
  }

  public processMouseDown(event: MouseEvent): void {
    if (event.target === this.textareaElementRef.nativeElement) {
      return;
    }
    event.preventDefault();
  }

  private processSizeChange(change: ComponentChange<this, TextareaSize>): void {
    const updatedValue: TextareaSize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.size$.next(updatedValue);
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

  private processIsPatchedChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isPatched$.next(updatedValue);
  }

  private processMaxLengthChange(change: ComponentChange<this, Nullable<number>>): void {
    const updatedValue: Nullable<number> = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.maxLength$.next(updatedValue);
  }

  private processMaxRowsChange(change: ComponentChange<this, Nullable<number>>): void {
    const updatedValue: Nullable<number> = change?.currentValue;

    if (isNil(updatedValue) || !Number.isInteger(updatedValue)) {
      return;
    }

    this.maxRows$.next(updatedValue);
  }

  private processMinRowsChange(change: ComponentChange<this, Nullable<number>>): void {
    const updatedValue: Nullable<number> = change?.currentValue;

    if (isNil(updatedValue) || !Number.isInteger(updatedValue)) {
      return;
    }

    this.minRows$.next(updatedValue);
  }

  private processCounterVisibilityChange(change: ComponentChange<this, TextAreaCounterVisibility>): void {
    const updatedValue: TextAreaCounterVisibility = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.counterVisibility$.next(updatedValue);
  }

  private processEnterKeyDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.enterKeyPrevented$.next(updatedValue);
  }

  private static getHeightPxByRowsCount(
    lineHeightSourceRef: ElementRef<HTMLTextAreaElement>,
    rowsCount: number,
    size: TextareaSize
  ): number {
    const verticalPaddingsPx: number =
      size === 'large' ? LARGE_TEXTAREA_VERTICAL_PADDINGS_PX : MEDIUM_TEXTAREA_VERTICAL_PADDINGS_PX;

    const computedStyles: CSSStyleDeclaration = getComputedStyle(lineHeightSourceRef.nativeElement);
    const lineHeightPx: number = Number.parseFloat(computedStyles.lineHeight);

    return lineHeightPx * rowsCount + verticalPaddingsPx;
  }
}
