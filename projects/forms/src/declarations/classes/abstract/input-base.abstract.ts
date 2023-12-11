import {
  AfterContentInit,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { concatBoolean, distinctUntilSerializedChanged, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { InputActionsLeftDirective } from '../../../components/input/directives/input-actions-left.directive';
import { InputActionsRightDirective } from '../../../components/input/directives/input-actions-right.directive';
import { isDate } from '../../../declarations/functions/is-date.function';
import { InputSize } from '../../types/input-size.type';
import { InputStyleCustomization } from '../../types/input-style-customization.type';
import { InputBaseControlValueAccessor } from './input-base-control-value-accessor.abstract';

@Directive()
export abstract class InputBase<T> extends InputBaseControlValueAccessor<T> implements OnChanges, AfterContentInit {
  @HostBinding('attr.pupa-control') public readonly controlAttribute: string = 'input';

  @ContentChild(InputActionsLeftDirective)
  public readonly inputActionsLeftDirective: InputActionsLeftDirective;

  @ContentChild(InputActionsRightDirective)
  public readonly inputActionsRightDirective: InputActionsRightDirective;

  @ViewChild('inputElement')
  protected readonly inputElementRef: ElementRef<HTMLInputElement>;

  @Input() public invalidTooltipHideOnHover: boolean = false;
  @Input() public invalidTooltipDisabled: boolean = false;
  @Input() public invalidTooltip: Nullable<string> = null;
  @Input() public invalidTooltipContentTemplate: Nullable<TemplateRef<unknown>> = null;

  @Input() public formControl: FormControl;

  @Input() public size: InputSize = 'medium';
  public readonly size$: BehaviorSubject<InputSize> = new BehaviorSubject<InputSize>('medium');

  @Input() public placeholder: string = '';
  public readonly placeholder$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Input() public autocomplete: boolean = false;
  public readonly autocomplete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public withReset: boolean = false;
  public readonly withReset$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public isPatched: boolean = false;
  public readonly isPatched$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public customStyles: InputStyleCustomization[] = [];
  public readonly customStyles$: BehaviorSubject<InputStyleCustomization[]> = new BehaviorSubject<
    InputStyleCustomization[]
  >([]);

  @Output() public readonly focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() public readonly blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

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

  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.size$,
    this.isInvalid$.pipe(map((isInvalid: boolean) => (isInvalid ? 'invalid' : null))),
    this.isFilled$.pipe(map((filled: boolean) => (filled ? 'filled' : null))),
    this.isDisabled$.pipe(map((isDisabled: boolean) => (isDisabled ? 'disabled' : null))),
    this.customStyles$.pipe(map((styles: InputStyleCustomization[]) => (!isEmpty(styles) ? styles.join('-') : null))),
  ]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `input-wrapper_${innerProperty}`)
    )
  );

  public readonly isVisibleReset$: Observable<boolean> = combineLatest([
    this.withReset$,
    this.isFilled$,
    this.isDisabled$,
  ]).pipe(
    map(([withReset, isFilled, isDisabled]: [boolean, boolean, boolean]) => withReset && isFilled && !isDisabled)
  );

  protected readonly isVisibleDefaultActions$: Observable<boolean> = combineLatest([
    this.isVisibleReset$,
    this.isInvalid$,
  ]).pipe(concatBoolean('or'), distinctUntilChanged());

  private readonly isVisibleSeparatorState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected readonly isVisibleSeparator$: Observable<boolean> = this.isVisibleSeparatorState$.pipe(
    distinctUntilChanged()
  );

  private readonly withDefaultRightIconState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  protected processIsPatchedChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isPatched$.next(updatedValue);
  }

  protected processWithResetChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.withReset$.next(updatedValue);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processFormControlChange(changes?.formControl);
    this.processSizeChange(changes?.size);
    this.processPlaceholderChange(changes?.placeholder);
    this.processAutocompleteChange(changes?.autocomplete);
    this.processIsPatchedChange(changes?.isPatched);
    this.processWithResetChange(changes?.withReset);
    this.processStylesChange(changes?.customStyles);
  }

  public ngAfterContentInit(): void {
    this.processActionSeparatorVisibilityChange();
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

  public focusOnInputElement(): void {
    const inputElement: HTMLInputElement = this.inputElementRef.nativeElement;
    inputElement.focus();
  }

  public setWithDefaultRightIconState(state: boolean): void {
    this.withDefaultRightIconState$.next(state);
  }

  public setIsVisibleSeparatorState(state: boolean): void {
    this.isVisibleSeparatorState$.next(state);
  }

  public processActionSeparatorVisibilityChange(): Subscription {
    return combineLatest([this.isVisibleReset$, this.isInvalid$, this.withDefaultRightIconState$])
      .pipe(
        map(
          ([isVisibleReset, isInvalid, withDefaultRightIcon]: [boolean, boolean, boolean]) =>
            (isVisibleReset || isInvalid) && (withDefaultRightIcon || !isNil(this.inputActionsRightDirective))
        )
      )
      .subscribe((isVisibleSeparator: boolean) => this.setIsVisibleSeparatorState(isVisibleSeparator));
  }

  private processFormControlChange(change: ComponentChange<this, FormControl>): void {
    const updatedValue: FormControl | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.setControlRef(this.ngControl);
  }

  private processSizeChange(change: ComponentChange<this, InputSize>): void {
    const updatedValue: InputSize | undefined = change?.currentValue;

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

  private processStylesChange(change: ComponentChange<this, InputStyleCustomization[]>): void {
    const updatedValue: InputStyleCustomization[] | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.customStyles$.next(updatedValue);
  }
}
