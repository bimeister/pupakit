import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  distinctUntilSerializedChanged,
  filterNotEmpty,
  filterNotNil,
  isEmpty,
  isNil,
  Nullable,
  resizeObservable,
} from '@bimeister/utilities';
import { DropdownMenuContextService } from '../../../dropdown-menu/services/dropdown-menu-context.service';
import { animationFrameScheduler, BehaviorSubject, combineLatest, merge, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, map, observeOn, switchMap } from 'rxjs/operators';
import { BreadcrumbsProducer } from '../../../../../internal/declarations/classes/breadcrumbs-producer.class';
import { BreadcrumbContext } from '../../../../../internal/declarations/interfaces/breadcrumb-context.interface';
import { Breadcrumb } from '../../../../../internal/declarations/interfaces/breadcrumb.interface';
import { BreadcrumbsParts } from '../../../../../internal/declarations/interfaces/breadcrumbs-parts.interface';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { ClientUiStateHandlerService } from '../../../../../internal/shared/services/client-ui-state-handler.service';
import { PupaBreadcrumbTemplateDirective } from '../../directives/breadcrumb-template.directive';

@Component({
  selector: 'pupa-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DropdownMenuContextService],
})
export class BreadcrumbsComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() public breadcrumbs: Breadcrumb[] = [];
  public readonly breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);

  @Output() public clickedBreadcrumbId: EventEmitter<Uuid> = new EventEmitter<Uuid>();

  @ViewChild('breadcrumbs') private readonly breadcrumbsContainerRef: ElementRef<HTMLElement>;
  @ViewChildren('breadcrumb') private readonly breadcrumbList: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('unfitBreadcrumbsTrigger') private readonly unfitBreadcrumbsTriggerRef: ElementRef<HTMLElement>;
  @ViewChild('defaultInnerTemplate') private readonly defaultInnerTemplateRef: TemplateRef<BreadcrumbContext>;

  @ContentChild(PupaBreadcrumbTemplateDirective) public readonly breadcrumbTemplate: PupaBreadcrumbTemplateDirective;

  private readonly breadcrumbsContainer$: BehaviorSubject<Nullable<HTMLElement>> = new BehaviorSubject<
    Nullable<HTMLDivElement>
  >(null);

  private readonly breadcrumbList$: BehaviorSubject<HTMLElement[]> = new BehaviorSubject<HTMLElement[]>([]);
  private readonly breadcrumbWidthList$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private readonly unfitBreadcrumbTriggerWidthPx$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<
    Nullable<number>
  >(null);
  public readonly isContainerFullFitted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private readonly breadcrumbsContainerWidthPx$: Observable<number> = this.breadcrumbsContainer$.pipe(
    observeOn(animationFrameScheduler),
    distinctUntilChanged(),
    switchMap((element: Nullable<HTMLDivElement>) => (!isNil(element) ? resizeObservable(element) : of([]))),
    map(([entry]: ResizeObserverEntry[]) => (!isNil(entry) ? entry.contentRect.width : 0))
  );

  public readonly isMobile$: Observable<boolean> = this.clientUiStateHandlerService.breakpointIsLessThanMd$;

  public readonly unfitBreadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);
  public readonly fitBreadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);
  public readonly rootBreadcrumb$: BehaviorSubject<Breadcrumb | null> = new BehaviorSubject<Breadcrumb | null>(null);

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    this.setBreadcrumbsContainer();
    this.setOverflowBreadcrumbTriggerWidth();
    this.subscription.add(this.setBreadcrumbListOnChanges());

    this.subscription.add(this.calculateBreadcrumbsWidths());
    this.subscription.add(this.calculateIsContainerFullFitted());
    this.subscription.add(this.calculateBreadcrumbsPlacement());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processBreadcrumbChange(changes?.breadcrumbs);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getBreadcrumbTemplate(): TemplateRef<BreadcrumbContext> {
    return this.breadcrumbTemplate?.templateRef ?? this.defaultInnerTemplateRef;
  }

  public handleClickOnUnfitTrigger(): void {
    this.detectChanges();
  }

  public emitClickedId(clickedId: Uuid, isActive: boolean = false): void {
    if (isActive) {
      return;
    }
    this.clickedBreadcrumbId.emit(clickedId);
  }

  private processBreadcrumbChange(change: ComponentChange<this, Breadcrumb[]>): void {
    const updatedBreadcrumbs: Breadcrumb[] | undefined = change?.currentValue;

    if (!Array.isArray(updatedBreadcrumbs) || isEmpty(updatedBreadcrumbs)) {
      return;
    }
    this.breadcrumbs$.next(updatedBreadcrumbs);
  }

  private setBreadcrumbsContainer(): void {
    this.breadcrumbsContainer$.next(this.breadcrumbsContainerRef.nativeElement);
  }

  private setOverflowBreadcrumbTriggerWidth(): void {
    const triggerElement: HTMLElement = this.unfitBreadcrumbsTriggerRef.nativeElement;
    this.unfitBreadcrumbTriggerWidthPx$.next(triggerElement.offsetWidth);
  }

  private setBreadcrumbListOnChanges(): Subscription {
    return merge(this.breadcrumbList.changes, of(this.breadcrumbList)).subscribe(
      (breadcrumbList: QueryList<ElementRef<HTMLElement>>) => {
        this.breadcrumbList$.next(breadcrumbList.map(({ nativeElement }: ElementRef<HTMLElement>) => nativeElement));
      }
    );
  }

  private calculateBreadcrumbsWidths(): Subscription {
    return this.breadcrumbsContainerWidthPx$
      .pipe(
        observeOn(animationFrameScheduler),
        switchMap(() => this.breadcrumbList$),
        filterNotEmpty(),
        map((breadcrumbElementList: HTMLElement[]) =>
          breadcrumbElementList.map(({ offsetWidth }: HTMLElement) => offsetWidth)
        )
      )
      .subscribe((elementWidthList: number[]) => this.breadcrumbWidthList$.next(elementWidthList));
  }

  private calculateIsContainerFullFitted(): Subscription {
    return combineLatest([this.breadcrumbsContainerWidthPx$, this.breadcrumbWidthList$])
      .pipe(
        map(([containerWidth, widthList]: [number, number[]]) => {
          const sumOfWidths: number = widthList.reduce(
            (partialSum: number, currentWidth: number) => partialSum + currentWidth,
            0
          );
          return sumOfWidths <= containerWidth;
        })
      )
      .subscribe((isContainerFullFitted: boolean) => this.isContainerFullFitted$.next(isContainerFullFitted));
  }

  private calculateBreadcrumbsPlacement(): Subscription {
    return combineLatest([
      this.breadcrumbs$,
      this.breadcrumbsContainerWidthPx$,
      this.isContainerFullFitted$,
      this.breadcrumbWidthList$.pipe(filterNotEmpty()),
      this.isMobile$,
      this.unfitBreadcrumbTriggerWidthPx$.pipe(filterNotNil()),
    ])
      .pipe(
        map(
          ([
            breadcrumbs,
            breadcrumbsContainerWidthPx,
            isContainerFullFitted,
            breadcrumbWidthList,
            isMobile,
            unfitBreadcrumbTriggerWidthPx,
          ]: [Breadcrumb[], number, boolean, number[], boolean, number]) =>
            new BreadcrumbsProducer({
              breadcrumbs,
              breadcrumbsContainerWidthPx,
              isContainerFullFitted,
              breadcrumbWidthList,
              isMobile,
              unfitBreadcrumbTriggerWidthPx,
            }).getBreadcrumbsParts()
        ),
        distinctUntilSerializedChanged()
      )
      .subscribe(({ unfitBreadcrumbs, fitBreadcrumbs, rootBreadcrumb }: BreadcrumbsParts) => {
        this.unfitBreadcrumbs$.next(unfitBreadcrumbs);
        this.fitBreadcrumbs$.next(fitBreadcrumbs);
        this.rootBreadcrumb$.next(rootBreadcrumb);
        this.detectChanges();
      });
  }

  private detectChanges(): void {
    this.changeDetectorRef.detectChanges();
  }
}
