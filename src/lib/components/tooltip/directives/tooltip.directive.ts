import { AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, TemplateRef } from '@angular/core';
import { filterFalsy, isNil, Nullable } from '@bimeister/utilities';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { ComponentChange } from '../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../internal/declarations/interfaces/component-changes.interface';
import { isTabletDevice } from '../../../../internal/helpers/is-tablet-device.helper';
import { TooltipService } from '../services/tooltip.service';

@Directive({
  selector: '[pupaTooltip]',
  providers: [TooltipService],
  exportAs: 'pupaTooltip',
})
export class PupaTooltipDirective implements OnChanges, OnDestroy, AfterViewInit {
  @Input() public tooltipHideOnHover: boolean = true;
  @Input() public tooltipDisabled: boolean = false;

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
        switchMap(() =>
          this.isDisabled$.pipe(
            take(1),
            filterFalsy(),
            filter(() => !isTabletDevice())
          )
        )
      )
      .subscribe(() => {
        this.tooltipService.processTriggerMouseEnter();
      });
  }

  private processTriggerMouseLeaveEvent(): Subscription {
    return this.triggerMouseLeave$.subscribe(() => {
      this.tooltipService.processTriggerMouseLeave();
    });
  }
}
