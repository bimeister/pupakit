import { Directive, ElementRef, Injector, Input, NgZone, OnDestroy, TemplateRef } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, merge, NEVER, Observable, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { subscribeOutsideAngular } from '../../../..//internal/functions/rxjs-operators/subscribe-outside-angular.operator';
import { OpenedPopover } from '../../../../internal/declarations/classes/opened-popover.class';
import { PopoversService } from '../../../../internal/shared/services/popovers.service';
import { PopoverTemplateComponent } from '../components/popover-template/popover-template.component';

@Directive({
  selector: '[pupaPopover]',
})
export class PopoverDirective implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  @Input() public pupaPopover: TemplateRef<unknown>;
  @Input() public pupaPopoverDisabled: boolean = false;

  private openedPopover: OpenedPopover | null = null;
  private isTouched: boolean = false;

  private readonly isOpenedState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isOpened$: Observable<boolean> = this.isOpenedState$.asObservable();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly popoversService: PopoversService,
    private readonly injector: Injector,
    private readonly ngZone: NgZone
  ) {
    this.subscription.add(this.processSelfClick());
    this.subscription.add(this.processSelfTouch());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.openedPopover?.close();
  }

  private processSelfClick(): Subscription {
    return fromEvent(this.elementRef.nativeElement, 'click')
      .pipe(
        filter(() => !this.pupaPopoverDisabled),
        switchMap(() => {
          if (this.isTouched) {
            this.isTouched = false;
            return NEVER;
          }

          this.openedPopover = this.popoversService.open<PopoverTemplateComponent<unknown>>({
            component: PopoverTemplateComponent,
            anchor: this.elementRef,
            injector: this.injector,
            hasBackdrop: false,
            data: {
              templateRef: this.pupaPopover,
            },
          });

          this.isOpenedState$.next(true);
          return this.openedPopover.closed$;
        })
      )
      .subscribe(() => {
        this.openedPopover = null;
        this.isOpenedState$.next(false);
      });
  }

  private processSelfTouch(): Subscription {
    return merge(
      fromEvent(this.elementRef.nativeElement, 'mousedown'),
      fromEvent(this.elementRef.nativeElement, 'touchstart')
    )
      .pipe(
        subscribeOutsideAngular(this.ngZone),
        filter(() => !isNil(this.openedPopover))
      )
      .subscribe(() => {
        this.isTouched = true;
      });
  }
}
