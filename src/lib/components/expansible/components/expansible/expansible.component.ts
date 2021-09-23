import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { filterNotNil, isNil } from '@bimeister/utilities';
import { BehaviorSubject, merge, Observable, of, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';
import { UnitHeightStyleChangesProcessor } from '../../../../../internal/declarations/classes/unit-height-style-changes-processor.class';
import { UnitWidthStyleChangesProcessor } from '../../../../../internal/declarations/classes/unit-width-style-changes-processor.class';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { HeightUnitBinding } from '../../../../../internal/declarations/interfaces/height-unit-binding.interface';
import { WidthUnitBinding } from '../../../../../internal/declarations/interfaces/width-unit-binding.interface';
import { ExpanderBehavior } from '../../../../../internal/declarations/types/expander-behavior.type';
import { Position } from '../../../../../internal/declarations/types/position.type';
import { ExpanderComponent } from '../expander/expander.component';

/** @dynamic */
@Component({
  selector: 'pupa-expansible',
  templateUrl: './expansible.component.html',
  styleUrls: ['./expansible.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansibleComponent
  implements OnInit, OnChanges, AfterContentInit, OnDestroy, WidthUnitBinding, HeightUnitBinding
{
  private readonly widthChangesProcessor: UnitWidthStyleChangesProcessor<this> = new UnitWidthStyleChangesProcessor(
    this.domSanitizer
  );
  private readonly heightChangesProcessor: UnitHeightStyleChangesProcessor<this> = new UnitHeightStyleChangesProcessor(
    this.domSanitizer
  );

  @Input() public width: string | null = null;
  @Input() public height: string | null = null;
  // tslint:disable: no-input-rename
  @Input('width.%') public widthPercents: number | null = null;
  @Input('height.%') public heightPercents: number | null = null;
  @Input('width.px') public widthPx: number | null = null;
  @Input('height.px') public heightPx: number | null = null;
  @Input('width.vw') public widthVw: number | null = null;
  @Input('height.vh') public heightVh: number | null = null;
  @Input('width.rem') public widthRem: number | null = null;
  @Input('height.rem') public heightRem: number | null = null;
  // tslint:enable: no-input-rename

  public readonly width$: Observable<SafeStyle> = this.widthChangesProcessor.safeStyle$;
  public readonly height$: Observable<SafeStyle> = this.heightChangesProcessor.safeStyle$;

  @ContentChildren(ExpanderComponent, {
    descendants: true
  })
  private readonly expandersList: QueryList<ExpanderComponent>;

  private readonly expanders$: BehaviorSubject<ExpanderComponent[]> = new BehaviorSubject<ExpanderComponent[]>([]);
  private readonly sanitizedExpanders$: Observable<ExpanderComponent[]> = this.expanders$.pipe(
    filter((expanders: ExpanderComponent[]) => Array.isArray(expanders) && !Object.is(expanders.length, 0)),
    shareReplay(1)
  );

  private readonly lastActiveExpander$: Observable<ExpanderComponent> = this.sanitizedExpanders$.pipe(
    switchMap((expanders: ExpanderComponent[]) =>
      merge(...expanders.map((expander: ExpanderComponent) => expander.activeControllerRef$))
    ),
    filter(
      (activeExpanderRef: ExpanderComponent | null): activeExpanderRef is NonNullable<ExpanderComponent> =>
        !isNil(activeExpanderRef)
    ),
    distinctUntilKeyChanged('id')
  );

  private readonly someExpanderIsActive$: Observable<boolean> = this.lastActiveExpander$.pipe(
    switchMap((lastActiveExpander: ExpanderComponent) => lastActiveExpander.activeControllerRef$),
    map((activeControllerRef: ExpanderComponent | null) => !isNil(activeControllerRef))
  );

  private readonly activeExpander$: Observable<ExpanderComponent | null> = this.someExpanderIsActive$.pipe(
    switchMap((someExpanderIsActive: boolean) => (someExpanderIsActive ? this.lastActiveExpander$ : of(null)))
  );

  private readonly subscription: Subscription = new Subscription();

  @HostBinding('style.width') public widthStyle: SafeStyle;
  @HostBinding('style.height') public heightStyle: SafeStyle;

  @HostBinding('style.left.px') public leftOffsetPx: number | null = null;
  @HostBinding('style.top.px') public topOffsetPx: number | null = null;
  @HostBinding('style.right.px') public rightOffsetPx: number | null = null;
  @HostBinding('style.bottom.px') public bottomOffsetPx: number | null = null;

  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.subscription
      .add(this.updateHostWidthOnWidthChanges())
      .add(this.updateHostHeightOnHeightChanges())
      .add(this.updateHostPositionOnPositionControllerMissmatchTargetPosition());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.heightChangesProcessor.process(changes);
    this.widthChangesProcessor.process(changes);
  }

  public ngAfterContentInit(): void {
    this.subscription.add(this.registerExpanders());
    this.expandersList.notifyOnChanges();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private registerExpanders(): Subscription {
    return this.expandersList.changes
      .pipe(map(() => this.expandersList.toArray()))
      .subscribe((expanders: ExpanderComponent[]) => this.expanders$.next(expanders));
  }

  private updateHostWidthOnWidthChanges(): Subscription {
    return this.width$.pipe(distinctUntilChanged()).subscribe((widthStyle: SafeStyle) => {
      this.widthStyle = widthStyle;
    });
  }

  private updateHostHeightOnHeightChanges(): Subscription {
    return this.height$.pipe(distinctUntilChanged()).subscribe((heightStyle: SafeStyle) => {
      this.heightStyle = heightStyle;
    });
  }

  private updateHostPositionOnPositionControllerMissmatchTargetPosition(): Subscription {
    return this.activeExpander$
      .pipe(
        filterNotNil(),
        switchMap(({ behavior$, positionMoveDelta$ }: ExpanderComponent) =>
          positionMoveDelta$.pipe(withLatestFrom(behavior$))
        ),
        filter(
          ([positionMove, behavior]: [Position, ExpanderBehavior]) => Array.isArray(positionMove) && !isNil(behavior)
        )
      )
      .subscribe(([[deltaXPx, deltaYPx], behavior]: [Position, ExpanderBehavior]) => {
        const containerClientRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
        const containerWidthPx: number = containerClientRect.width;
        const containerHeightPx: number = containerClientRect.height;
        const containerLeftOffsetPx: number = containerClientRect.x;
        const containerTopOffsetPx: number = containerClientRect.y;
        const containerRightOffsetPx: number = containerClientRect.right;
        const containerBottomOffsetPx: number = containerClientRect.bottom;

        switch (behavior) {
          case 'vertical': {
            const targetHeightPx: number = containerHeightPx - deltaYPx;
            this.updateHeightStyle(targetHeightPx);
            this.updateTopOffsetStyle(containerTopOffsetPx + deltaYPx / 2);
            this.updateBottomOffsetStyle(containerBottomOffsetPx - deltaXPx / 2);
            break;
          }
          case 'top': {
            const targetHeightPx: number = containerHeightPx - deltaYPx;
            this.updateHeightStyle(targetHeightPx);
            this.updateTopOffsetStyle(containerTopOffsetPx + deltaYPx);
            this.updateBottomOffsetStyle(containerBottomOffsetPx);
            break;
          }
          case 'bottom': {
            const targetHeightPx: number = containerHeightPx + deltaYPx;
            this.updateHeightStyle(targetHeightPx);
            this.updateTopOffsetStyle(containerTopOffsetPx);
            this.updateBottomOffsetStyle(containerBottomOffsetPx + deltaYPx);
            break;
          }

          case 'horizontal': {
            const targetWidthPx: number = containerWidthPx - deltaXPx;
            this.updateWidthStyle(targetWidthPx);
            this.updateLeftOffsetStyle(containerLeftOffsetPx + deltaXPx / 2);
            this.updateRightOffsetStyle(containerRightOffsetPx - deltaXPx / 2);
            break;
          }
          case 'right': {
            const targetWidthPx: number = containerWidthPx + deltaXPx;
            this.updateWidthStyle(targetWidthPx);
            this.updateLeftOffsetStyle(containerLeftOffsetPx);
            this.updateRightOffsetStyle(containerLeftOffsetPx + deltaXPx);
            break;
          }
          case 'left': {
            const targetWidthPx: number = containerWidthPx - deltaXPx;
            this.updateWidthStyle(targetWidthPx);
            this.updateLeftOffsetStyle(containerLeftOffsetPx + deltaXPx);
            this.updateRightOffsetStyle(containerRightOffsetPx);
            break;
          }

          case 'right-top': {
            const targetWidthPx: number = containerWidthPx + deltaXPx;
            this.updateWidthStyle(targetWidthPx);
            this.updateLeftOffsetStyle(containerLeftOffsetPx);
            this.updateRightOffsetStyle(containerLeftOffsetPx + deltaXPx);

            const targetHeightPx: number = containerHeightPx - deltaYPx;
            this.updateHeightStyle(targetHeightPx);
            this.updateTopOffsetStyle(containerTopOffsetPx + deltaYPx);
            this.updateBottomOffsetStyle(containerBottomOffsetPx);
            break;
          }
          case 'right-bottom': {
            const targetWidthPx: number = containerWidthPx + deltaXPx;
            this.updateWidthStyle(targetWidthPx);
            this.updateLeftOffsetStyle(containerLeftOffsetPx);
            this.updateRightOffsetStyle(containerLeftOffsetPx + deltaXPx);

            const targetHeightPx: number = containerHeightPx + deltaYPx;
            this.updateHeightStyle(targetHeightPx);
            this.updateTopOffsetStyle(containerTopOffsetPx);
            this.updateBottomOffsetStyle(containerBottomOffsetPx + deltaYPx);
            break;
          }
          case 'left-bottom': {
            const targetWidthPx: number = containerWidthPx - deltaXPx;
            this.updateWidthStyle(targetWidthPx);
            this.updateLeftOffsetStyle(containerLeftOffsetPx + deltaXPx);
            this.updateRightOffsetStyle(containerRightOffsetPx);

            const targetHeightPx: number = containerHeightPx + deltaYPx;
            this.updateHeightStyle(targetHeightPx);
            this.updateTopOffsetStyle(containerTopOffsetPx);
            this.updateBottomOffsetStyle(containerBottomOffsetPx + deltaYPx);
            break;
          }
          case 'left-top': {
            const targetWidthPx: number = containerWidthPx - deltaXPx;
            this.updateWidthStyle(targetWidthPx);
            this.updateLeftOffsetStyle(containerLeftOffsetPx + deltaXPx);
            this.updateRightOffsetStyle(containerRightOffsetPx);

            const targetHeightPx: number = containerHeightPx - deltaYPx;
            this.updateHeightStyle(targetHeightPx);
            this.updateTopOffsetStyle(containerTopOffsetPx + deltaYPx);
            this.updateBottomOffsetStyle(containerBottomOffsetPx);
            break;
          }

          default: {
            return;
          }
        }
        this.changeDetectorRef.markForCheck();
      });
  }

  private updateWidthStyle(targetWidthPx: number): void {
    this.widthStyle = this.domSanitizer.bypassSecurityTrustStyle(`${targetWidthPx}px`);
  }

  private updateHeightStyle(targetHeightPx: number): void {
    this.heightStyle = this.domSanitizer.bypassSecurityTrustStyle(`${targetHeightPx}px`);
  }

  private updateLeftOffsetStyle(targetOffsetPx: number | null): void {
    this.leftOffsetPx = targetOffsetPx;
  }

  private updateTopOffsetStyle(targetOffsetPx: number | null): void {
    this.topOffsetPx = targetOffsetPx;
  }

  private updateRightOffsetStyle(targetOffsetPx: number | null): void {
    this.rightOffsetPx = targetOffsetPx;
  }

  private updateBottomOffsetStyle(targetOffsetPx: number | null): void {
    this.bottomOffsetPx = targetOffsetPx;
  }
}
