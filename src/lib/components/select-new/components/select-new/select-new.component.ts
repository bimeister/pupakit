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
import { isNil } from '@meistersoft/utilities';

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

  @HostListener('window:click', ['$event'])
  public processClick(event: MouseEvent): void {
    const target: EventTarget = event.target;
    const currentElement: Element = this.elementRef.nativeElement;

    if (SelectNewComponent.targetExistsInCurrentElementChildren(target, currentElement)) {
      return;
    }
    this.selectNewStateService.collapse();
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

  private static targetExistsInCurrentElementChildren(target: EventTarget, currentElement: Element): boolean {
    if (target instanceof Element) {
      return SelectNewComponent.allElementChildren(currentElement).includes(target);
    }

    return false;
  }

  private static allElementChildren(currentElement: Element, extractedChildren: Element[] = []): Element[] {
    if (isNil(currentElement)) {
      return extractedChildren;
    }

    const currentLevelChildren: Element[] = Array.from(currentElement.children);
    const nestedLevelsChildren: Element[] = currentLevelChildren
      .map((element: Element) => SelectNewComponent.allElementChildren(element, currentLevelChildren))
      .flat(1);

    return [...extractedChildren, ...nestedLevelsChildren];
  }
}
