import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
} from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { OpenedDropdown } from '../../../declarations/classes/opened-dropdown.class';
import { DropdownDirectiveParams } from '../../../declarations/interfaces/dropdown-directive-params.interface';
import { DropdownHost } from '../../../declarations/interfaces/dropdown-host.interface';
import { DropdownTemplateComponent } from '../components/dropdown-template/dropdown-template.component';
import { subscribeInsideAngular, subscribeOutsideAngular, Theme, ThemeService } from '@bimeister/pupakit.common';
import { DropdownsService } from '../../../services/dropdowns.service';
import { ThemeWrapperService } from '../../theme-wrapper/services/theme-wrapper.service';

const CURSOR_POINTER: string = 'pointer';

@Directive({
  selector: '[pupaDropdown]',
  exportAs: 'pupaDropdown',
})
export class DropdownDirective implements AfterViewInit, OnDestroy, DropdownHost {
  @Input() public pupaDropdownDisabled: boolean = false;
  @Input() public pupaDropdownRealTriggerElement?: HTMLElement;

  @HostBinding('style.cursor') public cursorStyle: string = CURSOR_POINTER;

  public readonly opened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly theme$: Observable<Theme> = this.themeWrapperService?.theme$ ?? this.themeService.theme$;

  private readonly subscription: Subscription = new Subscription();
  private readonly isTriggerTouched$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private dropdown: Nullable<OpenedDropdown> = null;
  private outsideTouchEventSubscription: Nullable<Subscription> = null;

  private params: DropdownDirectiveParams | null = null;

  constructor(
    public readonly triggerRef: ElementRef<HTMLElement>,
    private readonly dropdownsService: DropdownsService,
    private readonly ngZone: NgZone,
    private readonly themeService: ThemeService,
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() private readonly themeWrapperService?: ThemeWrapperService
  ) {}

  public ngAfterViewInit(): void {
    this.subscription.add(this.handleTriggerClickEvents());
    this.subscription.add(this.handleTriggerTouchEvents());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setDropdownParams(params: DropdownDirectiveParams): void {
    this.params = params;
  }

  public open(): void {
    if (this.params === null) {
      throw new Error('[DropdownDirective] dropdownParams has not set. You can set *pupaDropdownTemplate on element');
    }

    if (this.pupaDropdownDisabled) {
      return;
    }

    this.theme$
      .pipe(
        take(1),
        switchMap((theme: Theme) => {
          this.dropdown = this.dropdownsService.open<DropdownTemplateComponent<unknown>>({
            target: this.pupaDropdownRealTriggerElement ?? this.triggerRef.nativeElement,
            widthType: this.params.widthType,
            horizontalPosition: this.params.horizontalPosition,
            theme,
            data: {
              templateRef: this.params.templateRef,
            },
          });

          this.opened$.next(true);
          this.isTriggerTouched$.next(false);
          this.outsideTouchEventSubscription = this.handleOutsideTriggerTouchEvents();

          return this.dropdown.closed$;
        })
      )
      .subscribe(() => {
        this.outsideTouchEventSubscription?.unsubscribe();
        this.opened$.next(false);
        this.dropdown = null;
      });
  }

  public close(): void {
    this.dropdown?.close();
  }

  public toggle(): void {
    this.opened$
      .pipe(take(1), subscribeInsideAngular(this.ngZone))
      .subscribe((opened: boolean) => (opened ? this.close() : this.open()));
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
