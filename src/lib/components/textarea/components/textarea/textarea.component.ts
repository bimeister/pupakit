import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { isNil, Nullable } from '@bimeister/utilities/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnitMinHeightStyleChangesProcessor } from '../../../../../internal/declarations/classes/unit-min-height-style-changes-processor.class';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { MinHeightUnitBinding } from '../../../../../internal/declarations/interfaces/min-height-unit-binding.interface';
import { OnChangeCallback } from '../../../../../internal/declarations/types/on-change-callback.type';
import { OnTouchedCallback } from '../../../../../internal/declarations/types/on-touched-callback.type';
import { TextareaResize } from '../../../../../internal/declarations/types/textarea-resize.type';
import { TextareaStateService } from '../../services/textarea-state.service';

@Component({
  selector: 'pupa-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [TextareaStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent<T> implements OnChanges, AfterViewInit, ControlValueAccessor, MinHeightUnitBinding {
  @Input() public readonly placeholder: string = '';

  @Input() public maxRows: number;
  public readonly maxRows$: BehaviorSubject<Nullable<number>> = new BehaviorSubject(null);

  @Input() public readonly resize: TextareaResize = 'both';
  public readonly resizeMode$: BehaviorSubject<string> = new BehaviorSubject('both');

  @ViewChild(CdkTextareaAutosize) public readonly cdkAutosizeDirective: CdkTextareaAutosize;
  @Input() public readonly autosize: boolean = false;
  public readonly autosizeIsEnabled$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @Input() public readonly maxLength: Nullable<number> = null;
  public readonly maxLength$: BehaviorSubject<Nullable<number>> = new BehaviorSubject(null);

  private readonly unitMinHeightStyleChangesProcessor: UnitMinHeightStyleChangesProcessor<this> = new UnitMinHeightStyleChangesProcessor(
    this.domSanitizer
  );

  @Input() public readonly minHeight: Nullable<string> = null;
  // tslint:disable: no-input-rename
  @Input('minHeight.%') public readonly minHeightPercents: Nullable<number> = null;
  @Input('minHeight.px') public readonly minHeightPx: Nullable<number> = null;
  @Input('minHeight.vw') public readonly minHeightVw: Nullable<number> = null;
  @Input('minHeight.rem') public readonly minHeightRem: Nullable<number> = null;
  // tslint:enable: no-input-rename

  @HostBinding('style.minHeight') public minHeightStyle: SafeStyle;

  public readonly minHeight$: Observable<SafeStyle> = this.unitMinHeightStyleChangesProcessor.safeStyle$;

  @Output() public focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() public blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  public readonly value$: BehaviorSubject<string> = this.textareaStateService.currentValue$;
  public readonly valueLength$: Observable<number> = this.textareaStateService.currentValueLength$;
  public readonly isDisabled$: BehaviorSubject<boolean> = this.textareaStateService.isDisabled$;
  public readonly isValid$: Observable<boolean> = this.textareaStateService.isValid$;
  public readonly isTouched$: Observable<boolean> = this.textareaStateService.isTouched$;

  constructor(
    @Optional() ngControl: NgControl,
    private readonly textareaStateService: TextareaStateService<T>,
    private readonly domSanitizer: DomSanitizer
  ) {
    if (isNil(ngControl)) {
      return;
    }
    ngControl.valueAccessor = this;

    this.textareaStateService.setControlRef(ngControl);
  }

  public ngAfterViewInit(): void {
    this.cdkAutosizeDirective.enabled = this.autosize;
    this.cdkAutosizeDirective.maxRows = this.maxRows;
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.unitMinHeightStyleChangesProcessor.process(changes);

    if (isNil(changes)) {
      return;
    }
    this.processResizeModeChange(changes?.resize);
    this.processAutosizeChange(changes?.autosize);
    this.processMaxLengthChange(changes?.maxLength);
    this.processMaxRowsChange(changes?.maxRows);
  }

  public updateValue(value: T): void {
    this.textareaStateService.updateValue(value);
  }

  public writeValue(newValue: T): void {
    this.textareaStateService.setValue(newValue);
  }

  public registerOnChange(onChange: OnChangeCallback<T>): void {
    this.textareaStateService.defineOnChangeCallback(onChange);
  }

  public registerOnTouched(onTouched: OnTouchedCallback): void {
    this.textareaStateService.defineOnTouchedCallback(onTouched);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.textareaStateService.setDisabledState(isDisabled);
  }

  public emitFocusEvent(focusEvent: FocusEvent): void {
    this.focus.emit(focusEvent);
  }

  public emitBlurEvent(blurEvent: FocusEvent): void {
    this.blur.emit(blurEvent);
  }

  public resizeTextareaToFitContent(): void {
    this.cdkAutosizeDirective.resizeToFitContent();
  }

  public resetTextareaToOriginalSize(): void {
    this.cdkAutosizeDirective.reset();
  }

  private processResizeModeChange(change: ComponentChange<this, TextareaResize>): void {
    const updatedValue: TextareaResize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.resizeMode$.next(updatedValue);
  }

  private processAutosizeChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue) || isNil(this.cdkAutosizeDirective)) {
      return;
    }

    this.cdkAutosizeDirective.enabled = updatedValue;
    this.autosizeIsEnabled$.next(updatedValue);
  }

  private processMaxLengthChange(change: ComponentChange<this, Nullable<number>>): void {
    const updatedValue: Nullable<number> = change?.currentValue;
    this.maxLength$.next(updatedValue);
  }

  private processMaxRowsChange(change: ComponentChange<this, Nullable<number>>): void {
    const updatedValue: Nullable<number> = change?.currentValue;

    if (isNil(this.cdkAutosizeDirective)) {
      return;
    }

    this.cdkAutosizeDirective.maxRows = updatedValue;
    this.maxRows$.next(updatedValue);
  }
}
