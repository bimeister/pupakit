import { Directive, EventEmitter, OnChanges, OnDestroy, Output, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { SelectStateServiceDeclaration } from '../../interfaces/select-state-service-declaration.interface';
import { OnChangeCallback } from '../../types/on-change-callback.type';
import { OnTouchedCallback } from '../../types/on-touched-callback.type';
import { SelectOuterValue } from '../../types/select-outer-value.type';
import { SelectSize } from '../../types/select-size.type';

@Directive()
export abstract class SelectBase<T> implements OnChanges, OnDestroy, ControlValueAccessor {
  public abstract isMultiSelectionEnabled: boolean;
  public abstract isUnselectionEnabled: boolean;
  public abstract isPatched: boolean;
  public abstract placeholder: string;
  public abstract withReset: boolean;
  public abstract inline: boolean;
  public abstract size: SelectSize;

  public invalidTooltipHideOnHover: boolean = false;
  public invalidTooltipDisabled: boolean = false;
  public invalidTooltip: Nullable<string> = null;
  public invalidTooltipContentTemplate: Nullable<TemplateRef<unknown>> = null;

  public readonly isTriggerTouched$: Observable<boolean> = this.selectStateService.isTriggerTouched$;

  @Output() public readonly focus: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly blur: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly reset: EventEmitter<void> = this.selectStateService.resetOutput;

  private readonly subscription: Subscription = new Subscription();

  constructor(protected readonly selectStateService: SelectStateServiceDeclaration<T>, ngControl: NgControl) {
    if (isNil(ngControl)) {
      return;
    }
    ngControl.valueAccessor = this;

    this.selectStateService.setControlRef(ngControl);

    this.subscription.add(this.handleIsExpandedChangesToEmitFocusEvents());
  }

  protected processCloseEvent(): void {
    this.selectStateService.collapse();
  }

  protected resetIsTriggerTouchedState(): void {
    this.selectStateService.setIsTriggerTouchedState(false);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsMultiSelectionEnabledValueChange(changes?.isMultiSelectionEnabled);
    this.processIsUnselectionEnabledValueChange(changes?.isUnselectionEnabled);
    this.processIsPatchedValueChange(changes?.isPatched);
    this.processPlaceholderValueChange(changes?.placeholder);
    this.processWithResetChange(changes?.withReset);
    this.processInlineChange(changes?.inline);
    this.processSizeChange(changes?.size);

    this.processInvalidTooltipHideOnHoverChange(changes?.invalidTooltipHideOnHover);
    this.processInvalidTooltipDisabledChange(changes?.invalidTooltipDisabled);
    this.processInvalidTooltipChange(changes?.invalidTooltip);
    this.processInvalidTooltipContentTemplateChange(changes?.invalidTooltipContentTemplate);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public writeValue(newValue: SelectOuterValue<T>): void {
    this.selectStateService.setValue(newValue);
    this.selectStateService.setIsFilled(!isEmpty(newValue));
  }

  public registerOnChange(onChange: OnChangeCallback<SelectOuterValue<T>>): void {
    this.selectStateService.defineOnChangeCallback(onChange);
  }

  public registerOnTouched(onTouched: OnTouchedCallback): void {
    this.selectStateService.defineOnTouchedCallback(onTouched);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.selectStateService.setDisabledState(isDisabled);
  }

  private processIsMultiSelectionEnabledValueChange(change: ComponentChange<this, boolean>): void {
    const updatedState: boolean | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.selectStateService.setMultiSelectionState(Boolean(updatedState));
  }

  private processIsUnselectionEnabledValueChange(change: ComponentChange<this, boolean>): void {
    const updatedState: boolean | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.selectStateService.setUnselectionState(Boolean(updatedState));
  }

  private processIsPatchedValueChange(change: ComponentChange<this, boolean>): void {
    const updatedState: boolean | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.selectStateService.setIsPatchedState(Boolean(updatedState));
  }

  private processPlaceholderValueChange(change: ComponentChange<this, string>): void {
    const updatedState: string | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.selectStateService.setPlaceholderState(updatedState);
  }

  private processWithResetChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.selectStateService.setWithResetState(updatedValue);
  }

  private processInlineChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectStateService.setInlineState(updatedValue);
  }

  private processSizeChange(change: ComponentChange<this, SelectSize>): void {
    const updatedValue: SelectSize | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectStateService.setSizeState(updatedValue);
  }

  private processInvalidTooltipHideOnHoverChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectStateService.setInvalidTooltipHideOnHoverState(updatedValue);
  }

  private processInvalidTooltipDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectStateService.setInvalidTooltipDisabledState(updatedValue);
  }

  private processInvalidTooltipChange(change: ComponentChange<this, Nullable<string>>): void {
    const updatedValue: Nullable<string> | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectStateService.setInvalidTooltipState(updatedValue);
  }

  private processInvalidTooltipContentTemplateChange(
    change: ComponentChange<this, Nullable<TemplateRef<unknown>>>
  ): void {
    const updatedValue: Nullable<TemplateRef<unknown>> | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectStateService.setInvalidTooltipContentTemplateState(updatedValue);
  }

  private handleIsExpandedChangesToEmitFocusEvents(): Subscription {
    return this.selectStateService.isExpanded$.subscribe((isExpanded: boolean) =>
      isExpanded ? this.focus.emit() : this.blur.emit()
    );
  }
}
