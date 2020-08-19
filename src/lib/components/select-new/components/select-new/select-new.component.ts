import { OverlayRef } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { getElementAllNestedChildren, isNil } from '@meistersoft/utilities';
import { map, take } from 'rxjs/operators';

import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { OnChangeCallback } from '../../../../../internal/declarations/types/on-change-callback.type';
import { OnTouchedCallback } from '../../../../../internal/declarations/types/on-touched-callback.type';
import { SelectOuterValue } from '../../../../../internal/declarations/types/select-outer-value.type';
import { SelectNewStateService } from '../../services/select-new-state.service';

@Component({
  selector: 'pupa-select-new',
  templateUrl: './select-new.component.html',
  styleUrls: ['./select-new.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectNewStateService]
})
export class SelectNewComponent<T> implements OnChanges, ControlValueAccessor {
  @Input() public isMultiSelectionEnabled: boolean = false;

  constructor(
    private readonly selectNewStateService: SelectNewStateService<T>,
    private readonly elementRef: ElementRef<HTMLElement>,
    @Optional() ngControl: NgControl
  ) {
    if (isNil(ngControl)) {
      return;
    }
    ngControl.valueAccessor = this;
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:touchstart', ['$event'])
  @HostListener('window:click', ['$event'])
  @HostListener('window:wheel', ['$event'])
  public closeOnOuterEvents(event: Event): void {
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
