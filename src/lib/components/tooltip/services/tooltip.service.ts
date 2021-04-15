import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable()
export class TooltipService implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly tooltipOverlayOrigin$: BehaviorSubject<CdkOverlayOrigin> = new BehaviorSubject<CdkOverlayOrigin>(
    null
  );

  private readonly mouseOverTrigger$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly mouseOverContent$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly mouseOverTooltip$: Observable<boolean> = combineLatest([
    this.mouseOverTrigger$.pipe(distinctUntilChanged()),
    this.mouseOverContent$.pipe(distinctUntilChanged())
  ]).pipe(
    debounceTime(0),
    map(([mouseOverTrigger, mouseOverContent]: [boolean, boolean]) => mouseOverTrigger || mouseOverContent)
  );

  private readonly isOpenedState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isOpened$: Observable<boolean> = this.isOpenedState$.pipe(distinctUntilChanged());

  private readonly isDisabledState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isDisabled$: Observable<boolean> = this.isDisabledState$.pipe(distinctUntilChanged());

  private readonly hideOnTooltipHoverState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly hideOnTooltipHover$: Observable<boolean> = this.hideOnTooltipHoverState$.pipe(distinctUntilChanged());

  constructor() {
    this.processMouseOverTooltipChanges();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public registerTooltipOverlayOrigin(tooltipOverlayOrigin: CdkOverlayOrigin): void {
    this.tooltipOverlayOrigin$.next(tooltipOverlayOrigin);
  }

  public setOpenedState(isOpened: boolean): void {
    this.isOpenedState$.next(isOpened);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabledState$.next(isDisabled);
  }

  public setHideOnTooltipHoverState(hideOnTooltipHover: boolean): void {
    this.hideOnTooltipHoverState$.next(hideOnTooltipHover);
  }

  public processTriggerMouseEnter(): void {
    this.mouseOverTrigger$.next(true);
  }

  public processTriggerMouseLeave(): void {
    this.mouseOverTrigger$.next(false);
  }

  public processContentMouseEnter(): void {
    this.mouseOverContent$.next(true);
  }

  public processContentMouseLeave(): void {
    this.mouseOverContent$.next(false);
  }

  private processMouseOverTooltipChanges(): Subscription {
    return this.mouseOverTooltip$.subscribe((mouseOverTooltip: boolean) => {
      this.setOpenedState(mouseOverTooltip);
    });
  }
}
