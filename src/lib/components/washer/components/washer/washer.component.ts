import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Predicate,
  ViewChild
} from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { BehaviorSubject, combineLatest, interval, Observable, of, Subscription, timer } from 'rxjs';
import { debounce, distinctUntilChanged, filter, map, throttle } from 'rxjs/operators';

import { remSizePx } from '../../../../../internal/constants/rem-size-px.const';
import { ExternalDiskContent } from '../../../../../internal/declarations/enums/external-disk-content.enum';
import { PanelExpansionState } from '../../../../../internal/declarations/enums/panel-expansion-state.enum';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { WasherButtonRoot } from '../../../../../internal/declarations/interfaces/washer-button-root.interface';
import { WasherButton } from '../../../../../internal/declarations/interfaces/washer-button.interface';

// tslint:disable: no-magic-numbers
@Component({
  selector: 'pupa-washer-panel',
  templateUrl: './washer.component.html',
  styleUrls: ['./washer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('isExternalPanelExpanded', [
      state(
        PanelExpansionState.dissapeared,
        style({
          transform: 'scale(0)'
        })
      ),
      state(
        PanelExpansionState.appeared,
        style({
          transform: 'scale(1)'
        })
      ),
      transition(`${PanelExpansionState.dissapeared} => ${PanelExpansionState.appeared}`, animate('0.25s ease')),
      transition(`${PanelExpansionState.appeared} => ${PanelExpansionState.dissapeared}`, animate('0.25s ease-in'))
    ]),
    trigger('buttonsAppearanceAnimation', [
      transition(':enter', [
        animate(
          '0.32s ease',
          keyframes([
            style({
              opacity: 0,
              transform: `translateY(${remSizePx}px)`
            }),
            style({
              opacity: 1,
              transform: 'translateY(0)'
            })
          ])
        )
      ]),
      transition(':leave', [
        animate(
          '0.32s ease',
          keyframes([
            style({
              opacity: 1,
              transform: 'translateY(0)'
            }),
            style({
              opacity: 0,
              transform: `translateY(${remSizePx}px)`
            })
          ])
        )
      ])
    ]),
    trigger('arcAppearanceAnimation', [
      transition(':enter', [
        animate(
          '0.2s ease',
          keyframes([
            style({
              opacity: 0,
              transform: `translateX(${remSizePx}px)`
            }),
            style({
              opacity: 1,
              transform: 'translateX(0)'
            })
          ])
        )
      ]),
      transition(':leave', [
        animate(
          '0.2s ease',
          keyframes([
            style({
              opacity: 1,
              transform: 'translateX(0)'
            }),
            style({
              opacity: 0,
              transform: `translateX(${remSizePx}px)`
            })
          ])
        )
      ])
    ]),
    trigger('washerAppearanceAnimation', [
      transition(':enter', [
        animate(
          '1s ease',
          keyframes([
            style({
              padding: `${100 * remSizePx}px 0 0 0`
            }),
            style({})
          ])
        )
      ]),
      transition(':leave', [
        animate(
          '0.32s ease',
          keyframes([
            style({}),
            style({
              padding: `${100 * remSizePx}px 0 0 0`
            })
          ])
        )
      ])
    ])
  ]
})
export class WasherComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('arcElement', { static: false }) public arcElement: ElementRef<HTMLDivElement>;
  @Input() public buttons: WasherButtonRoot[] = [];
  @Input() public range: number = 50;
  @Input() public centralButton: WasherButton = null;
  @Output() public action: EventEmitter<string> = new EventEmitter<string>();
  @Output() public rangeChange: EventEmitter<number> = new EventEmitter<number>();

  public isPanelExpanded$: BehaviorSubject<PanelExpansionState> = new BehaviorSubject<PanelExpansionState>(
    PanelExpansionState.dissapeared
  );
  public isAdditionalPanelVisible$: BehaviorSubject<PanelExpansionState> = new BehaviorSubject<PanelExpansionState>(
    PanelExpansionState.dissapeared
  );

  public readonly range$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly buttons$: BehaviorSubject<WasherButtonRoot[]> = new BehaviorSubject<WasherButtonRoot[]>([]);
  public readonly rotations$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public readonly middleDiskRadiusPx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly marginBottom$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly rangeMarkerRotation$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly rangeMinRotation$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly rangeMaxRotation$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly externalDiskContent$: BehaviorSubject<ExternalDiskContent> = new BehaviorSubject<ExternalDiskContent>(
    ExternalDiskContent.range
  );
  public readonly externalDiskButtons$: BehaviorSubject<WasherButton[]> = new BehaviorSubject<WasherButton[]>([]);
  public readonly activeButton$: BehaviorSubject<WasherButtonRoot> = new BehaviorSubject<WasherButtonRoot>(null);
  public readonly isCentralValueVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly additionalPanelButtons$: BehaviorSubject<WasherButton[]> = new BehaviorSubject<WasherButton[]>([]);
  public readonly additionalPanelButtonsRotations$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  public readonly safeRatio: number = 1.75;

  public angleRad: number = Math.PI / 2;
  public buttonPaddingPx: number = 8;
  public buttonSizePx: number = remSizePx * 1.5;
  public get remSizePx(): number {
    return remSizePx;
  }

  private readonly allButtons$: BehaviorSubject<WasherButtonRoot[]> = new BehaviorSubject<WasherButtonRoot[]>([]);
  private readonly allButtonsRotations$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private readonly middleDiskWithAllButtonsRadius$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private readonly alwaysVisibleButtons$: BehaviorSubject<WasherButtonRoot[]> = new BehaviorSubject<WasherButtonRoot[]>(
    []
  );
  private readonly alwaysVisibleButtonsRotations$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private readonly middleDiskWithAlwaysVisibleButtonsRadius$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private readonly isGrabbing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly mouseCoords$: BehaviorSubject<[number, number]> = new BehaviorSubject<[number, number]>([0, 0]);

  private readonly subscription: Subscription = new Subscription();

  @HostListener('window:mouseup', ['$event'])
  public endGrabbing(event: MouseEvent): void {
    event.stopPropagation();
    this.isGrabbing$.next(false);
  }

  @HostListener('window:mousemove', ['$event'])
  public getMouseCoords(event: MouseEvent): void {
    event.stopPropagation();
    this.mouseCoords$.next([event.pageX, event.pageY]);
  }

  public ngOnInit(): void {
    this.updateButtonsAlwaysVisibleOnButtonsArrayChange();
    this.updateRotationsOnButtonsArraysChanges();
    this.switchDataOnHover();
    this.processGrabbing();
    this.updateDataOnActiveButtonChange();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (!Array.isArray(changes.buttons.currentValue) || changes.buttons.currentValue.length === 0) {
      this.allButtons$.next([]);
    }
    this.allButtons$.next(changes.buttons.currentValue);

    if (isNil(changes.range)) {
      return;
    }
    if (!isNil(changes.range) && isNil(changes.range.currentValue)) {
      this.range$.next(0);
    }
    this.range$.next(changes.range.currentValue);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public startGrabbing(event: MouseEvent): void {
    event.stopPropagation();
    this.isGrabbing$.next(true);
  }

  public processRangeEditByWheel(wheelEvent: WheelEvent): void {
    wheelEvent.stopPropagation();
    wheelEvent.preventDefault();
    const activeButton: WasherButtonRoot = this.activeButton$.getValue();
    if (isNil(activeButton) || !activeButton.rangeOnClick) {
      return;
    }
    const deltaIsPositive: boolean = wheelEvent.deltaY > 0;
    const currentValue: number = Math.ceil(this.range$.getValue());
    const modification: number = deltaIsPositive ? +1 : -1;
    const valueToBeSet: number = currentValue + modification;
    if (valueToBeSet <= 0) {
      this.range$.next(0);
      return;
    }
    if (valueToBeSet >= 100) {
      this.range$.next(100);
      return;
    }
    this.range$.next(valueToBeSet);
  }

  public setPanelExpansionState(isExpanded: string): void {
    this.isPanelExpanded$.next(isExpanded as PanelExpansionState);
  }

  public processButtonClick(event: MouseEvent, clickedButton?: WasherButtonRoot): void {
    event.stopPropagation();
    const isCentralButton: boolean = isNil(clickedButton);
    const buttonHasChildren: boolean = !isCentralButton && this.hasChildren(clickedButton);
    const buttonOpensRange: boolean = !isCentralButton && clickedButton.rangeOnClick;
    if (isCentralButton) {
      const centralButton: WasherButton = this.centralButton;
      this.activeButton$.next(null);
      this.action.emit(centralButton.actionName);
      this.isAdditionalPanelVisible$.next(PanelExpansionState.dissapeared);
      return;
    }
    if (!buttonHasChildren && !buttonOpensRange) {
      this.action.emit(clickedButton.actionName);
    }
    this.activeButton$.next(clickedButton);
    this.isAdditionalPanelVisible$.next(
      clickedButton.rangeOnClick || this.hasChildren(clickedButton)
        ? PanelExpansionState.appeared
        : PanelExpansionState.dissapeared
    );
  }

  public trackByActionName(index: number, item: WasherButton): string {
    return item.actionName;
    index;
  }

  public hasChildren: Predicate<WasherButtonRoot> = (button: WasherButtonRoot): boolean => {
    return !isNil(button) && Array.isArray(button.children) && button.children.length !== 0;
  };

  private updateButtonsAlwaysVisibleOnButtonsArrayChange(): void {
    const buttonsAlwaysVisible$: Observable<WasherButtonRoot[]> = this.allButtons$.pipe(
      map((innerButtons: WasherButtonRoot[]) => innerButtons.filter(innerButton => innerButton.isAlwaysVisible))
    );
    this.subscription.add(
      buttonsAlwaysVisible$.subscribe((innerButtons: WasherButtonRoot[]) =>
        this.alwaysVisibleButtons$.next(innerButtons)
      )
    );
  }

  private updateRotationsOnButtonsArraysChanges(): void {
    const buttonsCount$: Observable<number> = this.allButtons$.pipe(
      map((innerButtons: WasherButtonRoot[]) => innerButtons.length)
    );
    const buttonsAlwaysVisibleCount$: Observable<number> = this.alwaysVisibleButtons$.pipe(
      map((innerButtons: WasherButtonRoot[]) => innerButtons.length)
    );
    this.subscription
      .add(
        buttonsCount$.subscribe((buttonsCount: number) => {
          const rotations: number[] = this.getRotationsArray(buttonsCount);
          this.allButtonsRotations$.next(rotations);

          const middleDiskRadiusPx: number = this.getMiddleDiskRadiusPx(buttonsCount);
          this.middleDiskWithAllButtonsRadius$.next(middleDiskRadiusPx);
        })
      )
      .add(
        buttonsAlwaysVisibleCount$.subscribe((buttonsCount: number) => {
          const rotations: number[] = this.getRotationsArray(buttonsCount);
          this.alwaysVisibleButtonsRotations$.next(rotations);
          const middleDiskRadiusPx: number = this.getMiddleDiskRadiusPx(buttonsCount);
          this.middleDiskWithAlwaysVisibleButtonsRadius$.next(middleDiskRadiusPx);
        })
      );
  }

  private switchDataOnHover(): void {
    enum Sources {
      full,
      filtered,
      trigger
    }
    enum States {
      expansion,
      grabbing
    }
    const isPanelExpanded$: Observable<boolean> = combineLatest([this.isPanelExpanded$, this.isGrabbing$]).pipe(
      map((innerStates: [PanelExpansionState, boolean]) =>
        innerStates[States.grabbing] ? true : innerStates[States.expansion] === PanelExpansionState.appeared
      ),
      debounce((innerValue: boolean) => (innerValue ? of(undefined) : timer(500))),
      distinctUntilChanged((x: boolean, y: boolean) => x === y)
    );
    const actualButtonsSource$: Observable<WasherButtonRoot[]> = combineLatest([
      this.allButtons$,
      this.alwaysVisibleButtons$,
      isPanelExpanded$
    ]).pipe(
      map((innerData: [WasherButtonRoot[], WasherButtonRoot[], boolean]) =>
        innerData[Sources.trigger] ? innerData[Sources.full] : innerData[Sources.filtered]
      )
    );
    const actualRotationsSource$: Observable<number[]> = combineLatest([
      this.allButtonsRotations$,
      this.alwaysVisibleButtonsRotations$,
      isPanelExpanded$
    ]).pipe(
      map((innerData: [number[], number[], boolean]) =>
        innerData[Sources.trigger] ? innerData[Sources.full] : innerData[Sources.filtered]
      )
    );
    const actualBottomMargin$: Observable<number> = combineLatest([
      this.middleDiskWithAllButtonsRadius$,
      this.middleDiskWithAlwaysVisibleButtonsRadius$,
      isPanelExpanded$
    ]).pipe(
      map((innerData: [number, number, boolean]) =>
        innerData[Sources.trigger]
          ? (innerData[Sources.full] - innerData[Sources.filtered]) * 0.5
          : innerData[Sources.filtered] * 0.15
      )
    );
    const actualMiddleDiskRadiusPx$: Observable<number> = combineLatest([
      this.middleDiskWithAllButtonsRadius$,
      this.middleDiskWithAlwaysVisibleButtonsRadius$,
      isPanelExpanded$
    ]).pipe(
      map((innerData: [number, number, boolean]) =>
        innerData[Sources.trigger] ? innerData[Sources.full] : innerData[Sources.filtered]
      )
    );
    const isAdditionalPanelVisible$: Observable<boolean> = this.isAdditionalPanelVisible$.pipe(
      map((innerState: PanelExpansionState) => innerState === PanelExpansionState.appeared)
    );
    const actualRangeRotation$: Observable<number> = combineLatest([
      this.rangeMinRotation$,
      this.rangeMaxRotation$,
      this.range$,
      isAdditionalPanelVisible$
    ]).pipe(
      map((innerData: [number, number, number, boolean]) => {
        enum Data {
          minRotation,
          maxRotation,
          range,
          trigger
        }
        const currentRangeValue: number = innerData[Data.range];
        if (currentRangeValue <= 0) {
          return [innerData[Data.minRotation], innerData[Data.trigger]];
        }
        if (currentRangeValue >= 100) {
          return [innerData[Data.maxRotation], innerData[Data.trigger]];
        }
        return [
          this.getAngleByPercentage(currentRangeValue, innerData[Data.minRotation], innerData[Data.maxRotation]),
          innerData[Data.trigger]
        ];
      }),
      map((innerData: [number, boolean]) => {
        enum Data {
          rotation,
          trigger
        }
        return innerData[Data.trigger] ? innerData[Data.rotation] : null;
      }),
      filter((innerValue: number) => !isNil(innerValue))
    );
    const isCentralValueVisible$: Observable<boolean> = combineLatest([
      this.activeButton$,
      this.isAdditionalPanelVisible$
    ]).pipe(
      map((innerData: [WasherButtonRoot, PanelExpansionState]) => {
        enum Data {
          button,
          trigger
        }
        const activeButtonIsCentral: boolean = isNil(innerData[Data.button]);
        const isPanelExpanded: boolean = innerData[Data.trigger] === PanelExpansionState.appeared;
        return isPanelExpanded && !activeButtonIsCentral && innerData[Data.button].rangeOnClick;
      })
    );
    this.subscription
      .add(actualButtonsSource$.subscribe((innerButtons: WasherButtonRoot[]) => this.buttons$.next(innerButtons)))
      .add(actualRotationsSource$.subscribe((innerRotations: number[]) => this.rotations$.next(innerRotations)))
      .add(actualBottomMargin$.subscribe((innerMaginValue: number) => this.marginBottom$.next(innerMaginValue)))
      .add(
        actualMiddleDiskRadiusPx$.subscribe((innerMiddleDiskRadiusPx: number) =>
          this.middleDiskRadiusPx$.next(innerMiddleDiskRadiusPx)
        )
      )
      .add(
        isPanelExpanded$
          .pipe(filter((innerValue: boolean) => !innerValue))
          .subscribe(() => this.isAdditionalPanelVisible$.next(PanelExpansionState.dissapeared))
      )
      .add(actualRangeRotation$.subscribe((innerValue: number) => this.rangeMarkerRotation$.next(innerValue)))
      .add(isCentralValueVisible$.subscribe((innerValue: boolean) => this.isCentralValueVisible$.next(innerValue)));
  }

  private processGrabbing(): void {
    enum Range {
      from,
      to
    }
    const throttledMouseCoord$: Observable<number> = this.mouseCoords$.pipe(
      map((innerCoords: [number, number]) => {
        enum Axis {
          x,
          y
        }
        return innerCoords[Axis.x];
      }),
      throttle(() => interval(10))
    );
    const rangeValueByMouseCoords$: Observable<number> = combineLatest([throttledMouseCoord$, this.isGrabbing$]).pipe(
      map((innerData: [number, boolean]) => {
        enum Data {
          coordX,
          trigger
        }
        return innerData[Data.trigger] ? innerData[Data.coordX] : undefined;
      }),
      filter((innerValue: number) => !isNil(innerValue)),
      map((mouseOffsetX: number) => {
        const elementOffsetX: number = this.arcElement.nativeElement.getBoundingClientRect().left;
        const mouseOffsetXfromElement: number = mouseOffsetX - elementOffsetX;
        return Math.ceil(mouseOffsetXfromElement);
      }),
      map((mouseOffsetXfromElement: number) => (mouseOffsetXfromElement <= 0 ? 0 : mouseOffsetXfromElement)),
      map((mouseOffsetXfromElement: number) => {
        const elementWidth: number = this.arcElement.nativeElement.offsetWidth;
        if (mouseOffsetXfromElement >= elementWidth) {
          return 100;
        }
        const percentage: number = (mouseOffsetXfromElement * 100) / elementWidth;
        return Math.ceil(percentage);
      })
    );

    const rotationRange$: Observable<[number, number]> = this.allButtonsRotations$.pipe(
      map((innerRotations: number[]) => {
        const firstRotation: number = innerRotations[0];
        const lastRotation: number = innerRotations[innerRotations.length - 1];
        return [firstRotation, lastRotation];
      })
    );

    this.subscription
      .add(
        rotationRange$.subscribe((innerRange: [number, number]) => {
          this.rangeMinRotation$.next(innerRange[Range.from]);
          this.rangeMaxRotation$.next(innerRange[Range.to]);
        })
      )
      .add(
        rangeValueByMouseCoords$.subscribe((innerPercentage: number) => {
          this.range$.next(innerPercentage);
        })
      )
      .add(this.range$.subscribe((innerValue: number) => this.rangeChange.emit(innerValue)));
  }

  private updateDataOnActiveButtonChange(): void {
    const activeButtonChildren$: Observable<WasherButton[]> = this.activeButton$.pipe(
      map((innerValue: WasherButtonRoot) =>
        !isNil(innerValue) && this.hasChildren(innerValue) ? innerValue.children : []
      )
    );
    const activeButtonChildrenRotations$: Observable<number[]> = activeButtonChildren$.pipe(
      map((innerValue: WasherButton[]) => innerValue.length),
      map((childrenCount: number) => this.getRotationsArray(childrenCount))
    );
    this.subscription
      .add(
        activeButtonChildren$.subscribe((innerButtons: WasherButton[]) =>
          this.additionalPanelButtons$.next(innerButtons)
        )
      )
      .add(
        activeButtonChildrenRotations$.subscribe((innerRotations: number[]) =>
          this.additionalPanelButtonsRotations$.next(innerRotations)
        )
      );
  }

  private getRotationsArray(elementsCount: number): number[] {
    const rotationStepRad: number = this.angleRad / elementsCount;
    const wholeSystemRotationRad: number = (Math.PI - this.angleRad) / 2;
    const additionalRotationRad: number = rotationStepRad / 2;
    return new Array(elementsCount).fill(null).map((_, index: number) => {
      return index * rotationStepRad + wholeSystemRotationRad + additionalRotationRad;
    });
  }

  private getAngleByPercentage(percentage: number, angleMin: number, angleMax: number): number {
    return ((angleMax - angleMin) / 100) * percentage + angleMin;
  }

  private getMiddleDiskRadiusPx(buttonsCount: number): number {
    const minButtonsCount: number = 3;
    const count: number = buttonsCount >= minButtonsCount ? buttonsCount : minButtonsCount;
    const arcLengthPx: number = count * (this.buttonSizePx + this.buttonPaddingPx) * this.safeRatio;
    return arcLengthPx / this.angleRad;
  }
  // tslint:enable: no-magic-numbers
}
