import { ConnectedOverlayPositionChange } from '@angular/cdk/overlay';
import { ElementRef, TemplateRef } from '@angular/core';
import { Nullable } from '@bimeister/utilities/common';
import { Observable } from 'rxjs';

export interface TooltipService {
  readonly isOpened$: Observable<boolean>;

  readonly isDisabled$: Observable<boolean>;

  readonly tooltipContent$: Observable<Nullable<string>>;

  readonly tooltipContentTemplate$: Observable<Nullable<TemplateRef<unknown>>>;

  readonly tooltipHideOnHoverHover$: Observable<boolean>;

  readonly tooltipPosition$: Observable<ConnectedOverlayPositionChange>;

  registerTooltipTriggerRef(triggerRef: ElementRef<HTMLElement>): void;

  setOpenedState(isOpened: boolean): void;

  setDisabledState(isDisabled: boolean): void;

  setTooltipHideOnHoverState(hideOnTooltipHover: boolean): void;

  setTooltipContentState(content: string): void;

  setTooltipContentTemplateState(template: TemplateRef<unknown>): void;

  processTriggerMouseEnter(): void;

  processTriggerMouseLeave(): void;

  processContentMouseEnter(): void;

  processContentMouseLeave(): void;
}
