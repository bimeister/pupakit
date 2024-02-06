import { Directive, ElementRef, Injector, Input, OnDestroy, TemplateRef } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { OpenedPopover } from '../../../declarations/classes/opened-popover.class';
import { PopoversService } from '../../../services/popovers.service';
import { PopoverTemplateComponent } from '../components/popover-template/popover-template.component';

@Directive({
  selector: '[pupaPopover]',
})
export class PopoverDirective implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  @Input() public pupaPopover: TemplateRef<unknown>;
  @Input() public pupaPopoverDisabled: boolean = false;

  private openedPopover: OpenedPopover | null = null;

  private readonly isOpenedState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isOpened$: Observable<boolean> = this.isOpenedState$.asObservable();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly popoversService: PopoversService,
    private readonly injector: Injector
  ) {
    this.subscription.add(this.processSelfClick());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.openedPopover?.close();
  }

  public getPopoverId(): string | null {
    return isNil(this.openedPopover) ? null : this.openedPopover.id;
  }

  private processSelfClick(): Subscription {
    return fromEvent(this.elementRef.nativeElement, 'click')
      .pipe(
        filter(() => !this.pupaPopoverDisabled),
        switchMap(() => {
          this.openedPopover = this.popoversService.open<PopoverTemplateComponent<unknown>>({
            component: PopoverTemplateComponent,
            anchor: this.elementRef,
            trigger: {
              element: this.elementRef.nativeElement,
            },
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
}
