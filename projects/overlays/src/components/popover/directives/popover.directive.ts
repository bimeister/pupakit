import { Directive, ElementRef, Injector, Input, OnDestroy, TemplateRef } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { OpenedPopover } from '../../../declarations/classes/opened-popover.class';
import { PopoversService } from '../../../services/popovers.service';
import { PopoverTemplateComponent } from '../components/popover-template/popover-template.component';

const DELAY_TIME: number = 1000;

@Directive({
  selector: '[pupaPopover]',
})
export class PopoverDirective implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  @Input() public pupaPopover: TemplateRef<unknown>;
  @Input() public pupaPopoverDisabled: boolean = false;
  @Input() public pupaPopoverHover: boolean = false;
  @Input() public pupaPopoverDelay: number = DELAY_TIME;

  private openedPopover: OpenedPopover | null = null;

  private readonly isOpenedState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isOpened$: Observable<boolean> = this.isOpenedState$.asObservable();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly popoversService: PopoversService,
    private readonly injector: Injector
  ) {
    this.subscription.add(this.processOnMouse());
    this.subscription.add(this.processOnClick());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.openedPopover?.close();
  }

  public getPopoverId(): string | null {
    return isNil(this.openedPopover) ? null : this.openedPopover.id;
  }

  private processOnClick(): Subscription {
    return fromEvent(this.elementRef.nativeElement, 'click')
      .pipe(filter(() => !this.pupaPopoverDisabled && !this.pupaPopoverHover))
      .subscribe((event: Event) => this.openPopover(event));
  }

  private processOnMouse(): Subscription {
    const mouseenter$: Observable<Event> = fromEvent(this.elementRef.nativeElement, 'mouseenter');
    const mouseleave$: Observable<Event> = fromEvent(this.elementRef.nativeElement, 'mouseleave');

    return merge(mouseenter$, mouseleave$)
      .pipe(
        filter(() => !this.pupaPopoverDisabled && this.pupaPopoverHover),
        debounceTime(this.pupaPopoverDelay)
      )
      .subscribe((event: Event) => {
        if (event.type === 'mouseleave') {
          this.closePopover();
        } else {
          this.openPopover(event);
        }
      });
  }

  private openPopover(event: Event): void {
    this.openedPopover = this.popoversService.open<PopoverTemplateComponent<unknown>>({
      component: PopoverTemplateComponent,
      anchor: this.elementRef,
      trigger: {
        element: this.elementRef.nativeElement,
      },
      injector: this.injector,
      hasBackdrop: false,
      autoCloseTimeout: event.type === 'click' ? null : this.pupaPopoverDelay,
      data: {
        templateRef: this.pupaPopover,
      },
    });
    this.isOpenedState$.next(true);
  }

  private closePopover(): void {
    if (isNil(this.openedPopover)) {
      return;
    }
    this.openedPopover = null;
    this.isOpenedState$.next(false);
  }
}
