import { AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, TemplateRef } from '@angular/core';
import { ComponentChange, ComponentChanges, isTabletDevice } from '@bimeister/pupakit.common';
import { filterFalsy, isNil, Nullable } from '@bimeister/utilities';
import { EMPTY, fromEvent, Observable, Subscription } from 'rxjs';
import { delay, filter, switchMap, take, tap } from 'rxjs/operators';
import { TOOLTIP_SERVICE_TOKEN } from '../../../declarations/tokens/tooltip-service.token';
import { TooltipAppearance } from '../../../declarations/types/tooltip-appearance.type';
import { TooltipService } from '../services/tooltip.service';

@Directive({
  selector: '[pupaTooltip]',
  providers: [
    TooltipService,
    {
      provide: TOOLTIP_SERVICE_TOKEN,
      useExisting: TooltipService,
    },
  ],
  exportAs: 'pupaTooltip',
})
export class PupaTooltipDirective implements OnChanges, OnDestroy, AfterViewInit {
  @Input() public tooltipHideOnHover: boolean = true;
  @Input() public tooltipDisabled: boolean = false;
  @Input() public tooltipDelayMs: number = 0;
  @Input() public tooltipAppearance: TooltipAppearance = 'always';

  @Input() public pupaTooltip: Nullable<string> = null;
  @Input() public tooltipContentTemplate: Nullable<TemplateRef<unknown>> = null;

  public readonly isOpened$: Observable<boolean> = this.tooltipService.isOpened$;
  private readonly isDisabled$: Observable<boolean> = this.tooltipService.isDisabled$;

  private readonly triggerMouseEnter$: Observable<MouseEvent> = fromEvent<MouseEvent>(
    this.triggerRef.nativeElement,
    'mouseenter'
  );
  private readonly triggerMouseLeave$: Observable<MouseEvent> = fromEvent<MouseEvent>(
    this.triggerRef.nativeElement,
    'mouseleave'
  );

  private isMouseOverElement: boolean = false;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly tooltipService: TooltipService, public readonly triggerRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.registerTooltipTriggerRef();

    this.subscription.add(this.processTriggerMouseEnterEvent());
    this.subscription.add(this.processTriggerMouseLeaveEvent());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDisabledChanges(changes?.tooltipDisabled);
    this.processHideOnTooltipHoverChanges(changes?.tooltipHideOnHover);
    this.processTooltipContentChanges(changes?.pupaTooltip);
    this.processTooltipContentTemplateChanges(changes?.tooltipContentTemplate);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processDisabledChanges(change: ComponentChange<this, boolean>): void {
    if (isNil(change)) {
      return;
    }

    this.tooltipService.setDisabledState(change.currentValue);

    if (change.currentValue) {
      this.tooltipService.setOpenedState(!change.currentValue);
    }
  }

  private processHideOnTooltipHoverChanges(change: ComponentChange<this, boolean>): void {
    if (isNil(change)) {
      return;
    }
    this.tooltipService.setTooltipHideOnHoverState(change.currentValue);
  }

  private processTooltipContentChanges(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.tooltipService.setTooltipContentState(updatedValue);
  }

  private processTooltipContentTemplateChanges(change: ComponentChange<this, TemplateRef<unknown>>): void {
    const updatedValue: TemplateRef<unknown> | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.tooltipService.setTooltipContentTemplateState(updatedValue);
  }

  private registerTooltipTriggerRef(): void {
    this.tooltipService.registerTooltipTriggerRef(this.triggerRef);
  }

  private processTriggerMouseEnterEvent(): Subscription {
    return this.triggerMouseEnter$
      .pipe(
        tap(() => (this.isMouseOverElement = true)),
        delay(this.tooltipDelayMs),
        filter(() => this.isMouseOverElement),
        switchMap(() => {
          const isDisabled$: Observable<boolean> = this.isDisabled$.pipe(
            take(1),
            filterFalsy(),
            filter(() => !Boolean(isTabletDevice()))
          );

          if (this.tooltipAppearance === 'truncate') {
            return this.isTextTruncated(this.triggerRef.nativeElement) ? isDisabled$ : EMPTY;
          }

          return isDisabled$;
        })
      )
      .subscribe(() => this.tooltipService.processTriggerMouseEnter());
  }

  private isTextTruncated(element: HTMLElement): boolean {
    const textTruncatedByWidth: boolean = element.scrollWidth > element.clientWidth;
    const textTruncatedByHeight: boolean = element.scrollHeight > element.clientHeight;

    return textTruncatedByWidth || textTruncatedByHeight;
  }

  private processTriggerMouseLeaveEvent(): Subscription {
    return this.triggerMouseLeave$
      .pipe(
        tap(() => {
          this.isMouseOverElement = false;
        })
      )
      .subscribe(() => {
        this.tooltipService.processTriggerMouseLeave();
      });
  }
}
