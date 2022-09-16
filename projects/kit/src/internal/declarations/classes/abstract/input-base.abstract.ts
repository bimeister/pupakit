import {
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
import { distinctUntilSerializedChanged, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isDate } from '../../../helpers/is-date.helper';
import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { InputSize } from '../../types/input-size.type';
import { InputStyleCustomization } from '../../types/input-style-customization.type';
import { InputBaseControlValueAccessor } from './input-base-control-value-accessor.abstract';

@Directive()
export abstract class InputBase<T> extends InputBaseControlValueAccessor<T> implements OnChanges {
  @HostBinding('attr.pupa-control') public readonly controlAttribute: string = 'input';

  @ViewChild('inputElement')
  protected readonly inputElementRef: ElementRef<HTMLInputElement>;

  @Input() public invalidTooltipHideOnHover: boolean = false;
  @Input() public invalidTooltipDisabled: boolean = false;
  @Input() public invalidTooltip: Nullable<string> = null;
  @Input() public invalidTooltipContentTemplate: Nullable<TemplateRef<unknown>> = null;

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

  @Input() public leftIcon: string = '';
  public readonly leftIcon$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Input() public rightIcon: string = '';
  public readonly rightIcon$: BehaviorSubject<string> = new BehaviorSubject<string>('');

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
    this.processSizeChange(changes?.size);
    this.processPlaceholderChange(changes?.placeholder);
    this.processAutocompleteChange(changes?.autocomplete);
    this.processIsPatchedChange(changes?.isPatched);
    this.processWithResetChange(changes?.withReset);
    this.processStylesChange(changes?.customStyles);
    this.processLeftIconChange(changes?.leftIcon);
    this.processRightIconChange(changes?.rightIcon);
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

  private processLeftIconChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.leftIcon$.next(updatedValue);
  }

  private processRightIconChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.rightIcon$.next(updatedValue);
  }
}
