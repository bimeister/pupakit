import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, ElementRef, OnChanges } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { getElementAllNestedChildren, isNil } from '@meistersoft/utilities';
import { map, take } from 'rxjs/operators';

import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { SelectStateService } from '../../interfaces/select-state-service.interface';
import { OnChangeCallback } from '../../types/on-change-callback.type';
import { OnTouchedCallback } from '../../types/on-touched-callback.type';
import { SelectOuterValue } from '../../types/select-outer-value.type';

@Directive()
export abstract class SelectBase<T> implements OnChanges, ControlValueAccessor {
  public abstract isMultiSelectionEnabled: boolean;

  constructor(
    private readonly selectNewStateService: SelectStateService<T>,
    private readonly elementRef: ElementRef<HTMLElement>,
    ngControl: NgControl
  ) {
    if (isNil(ngControl)) {
      return;
    }
    ngControl.valueAccessor = this;
  }

  protected processCloseEvent(event: Event): void {
    const eventTarget: EventTarget = event.target;

    if (!(eventTarget instanceof Element)) {
      this.selectNewStateService.collapse();
      return;
    }

    this.selectNewStateService.dropdownOverlayRef$
      .pipe(
        take(1),
        map((overlayRef: OverlayRef | null | undefined) => {
          return isNil(overlayRef) ? null : overlayRef.overlayElement;
        })
      )
      .subscribe((overlayElement: Element | null) => {
        const currentComponentElement: Element = this.elementRef.nativeElement;
        const currentComponentElementChildren: Element[] = getElementAllNestedChildren(currentComponentElement);

        const dropdownElementChildren: Element[] = isNil(overlayElement)
          ? []
          : getElementAllNestedChildren(overlayElement);

        const dropdownElements: Element[] = [...currentComponentElementChildren, ...dropdownElementChildren];
        const isInnerEvent: boolean = dropdownElements.includes(eventTarget);

        if (isInnerEvent) {
          return;
        }

        this.selectNewStateService.collapse();
      });
  }

  public abstract closeOnOuterEvents(event: Event): void;

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processIsMultiSelectionEnabledValueChange(changes?.isMultiSelectionEnabled);
  }

  public writeValue(newValue: SelectOuterValue<T>): void {
    this.selectNewStateService.setValue(newValue);
  }

  public registerOnChange(onChange: OnChangeCallback<SelectOuterValue<T>>): void {
    this.selectNewStateService.defineOnChangeCallback(onChange);
  }

  public registerOnTouched(onTouched: OnTouchedCallback): void {
    this.selectNewStateService.defineOnTouchedCallback(onTouched);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.selectNewStateService.setDisabledState(isDisabled);
  }

  private processIsMultiSelectionEnabledValueChange(change: ComponentChange<this, boolean>): void {
    const updatedState: boolean | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.selectNewStateService.setMultiSelectionState(Boolean(updatedState));
  }
}
