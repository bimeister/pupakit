import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject, Input, NgZone, OnDestroy, TemplateRef } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, merge, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { OpenedDropdown } from '../../../../internal/declarations/classes/opened-dropdown.class';
import { DropdownWidthType } from '../../../../internal/declarations/types/dropdown-width.type';
import { subscribeOutsideAngular } from '../../../../internal/functions/rxjs-operators/subscribe-outside-angular.operator';
import { DropdownsService } from '../../../../internal/shared/services/dropdowns.service';
import { DropdownTemplateComponent } from '../../../../lib/components/dropdown/components/dropdown-template/dropdown-template.component';

@Directive({
  selector: '[pupaDropdown]',
  exportAs: 'pupaDropdown',
})
export class DropdownDirective implements AfterViewInit, OnDestroy {
  @Input() public pupaDropdown: TemplateRef<unknown>;
  @Input() public pupaDropdownDisabled: boolean = false;
  @Input() public pupaDropdownWidthType: DropdownWidthType = 'auto';

  public readonly opened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly subscription: Subscription = new Subscription();
  private readonly isTriggerTouched$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private dropdown: Nullable<OpenedDropdown> = null;
  private outsideTouchEventSubscription: Nullable<Subscription> = null;

  constructor(
    public readonly triggerRef: ElementRef<HTMLElement>,
    private readonly dropdownsService: DropdownsService,
    private readonly ngZone: NgZone,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  public ngAfterViewInit(): void {
    this.subscription.add(this.handleTriggerClickEvents());
    this.subscription.add(this.handleTriggerTouchEvents());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public open(): void {
    if (this.pupaDropdownDisabled) {
      return;
    }

    this.dropdown = this.dropdownsService.open<DropdownTemplateComponent<unknown>>({
      target: this.triggerRef,
      widthType: this.pupaDropdownWidthType,
      data: {
        templateRef: this.pupaDropdown,
      },
    });

    this.opened$.next(true);
    this.isTriggerTouched$.next(false);
    this.outsideTouchEventSubscription = this.handleOutsideTriggerTouchEvents();

    this.dropdown.closed$.pipe(take(1)).subscribe(() => {
      this.outsideTouchEventSubscription?.unsubscribe();
      this.opened$.next(false);
      this.dropdown = null;
    });
  }

  public close(): void {
    this.dropdown?.close();
  }

  public toggle(): void {
    this.opened$.pipe(take(1)).subscribe((opened: boolean) => (opened ? this.close() : this.open()));
  }

  private handleTriggerClickEvents(): Subscription {
    return fromEvent(this.triggerRef.nativeElement, 'click').subscribe(() => this.toggle());
  }

  private handleTriggerTouchEvents(): Subscription {
    return merge(
      fromEvent(this.triggerRef.nativeElement, 'touchstart'),
      fromEvent(this.triggerRef.nativeElement, 'mousedown')
    )
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe(() => {
        this.isTriggerTouched$.next(true);
      });
  }

  private handleOutsideTriggerTouchEvents(): Subscription {
    return merge(fromEvent(this.document, 'mousedown'), fromEvent(this.document, 'touchstart'))
      .pipe(
        switchMap(() => this.isTriggerTouched$.pipe(take(1))),
        subscribeOutsideAngular(this.ngZone)
      )
      .subscribe((isTriggerTouched: boolean) => (isTriggerTouched ? this.isTriggerTouched$.next(false) : this.close()));
  }
}
