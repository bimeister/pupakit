import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { remSizePx } from './../../../constants/rem-size-px.const';

export interface WasherButton {
  icon: string;
  isAlwaysVisible: boolean;
  actionName: string;
}
export enum PanelExpansionState {
  initial = 'void',
  dissapeared = 'false',
  appeared = 'true'
}
@Component({
  // tslint:disable: no-magic-numbers
  selector: 'pupa-washer-panel',
  templateUrl: './washer-panel.component.html',
  styleUrls: ['./washer-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('isPanelExpanded', [
      state(
        PanelExpansionState.dissapeared,
        style({
          // margin: '4% 0 0'
        })
      ),
      state(
        PanelExpansionState.appeared,
        style({
          // margin: 0
        })
      ),
      transition(`${PanelExpansionState.dissapeared} => ${PanelExpansionState.appeared}`, animate('0.25s ease')),
      transition(`${PanelExpansionState.appeared} => ${PanelExpansionState.dissapeared}`, animate('0.25s ease-out'))
    ])
  ]
  // tslint:enable: no-magic-numbers
})
export class WasherPanelComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('containerElement', { static: true }) public containerElement: ElementRef<HTMLDivElement>;
  @ViewChild('middleDiskElement', { static: true }) public middleDiskElement: ElementRef<HTMLDivElement>;
  @Input() public buttons: WasherButton[] = [];

  public isPanelExpanded$: BehaviorSubject<PanelExpansionState> = new BehaviorSubject<PanelExpansionState>(
    PanelExpansionState.dissapeared
  );
  public isAdditionalPanelVisible$: BehaviorSubject<PanelExpansionState> = new BehaviorSubject<PanelExpansionState>(
    PanelExpansionState.dissapeared
  );
  public buttons$: BehaviorSubject<WasherButton[]> = new BehaviorSubject<WasherButton[]>([]);
  public rotations$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public middleDiskRadiusPx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public marginBottom$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private readonly allButtons$: BehaviorSubject<WasherButton[]> = new BehaviorSubject<WasherButton[]>([]);
  private readonly allButtonsRotations$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private readonly middleDiskWithAllButtonsRadius$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private readonly alwaysVisibleButtons$: BehaviorSubject<WasherButton[]> = new BehaviorSubject<WasherButton[]>([]);
  private readonly alwaysVisibleButtonsRotations$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private readonly middleDiskWithAlwaysVisibleButtonsRadius$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // tslint:disable: no-magic-numbers
  public angleRad: number = Math.PI / 2;
  public buttonPaddingPx: number = 8;
  public buttonSizePx: number = remSizePx * 1.5;
  // tslint:enable: no-magic-numbers
  public get remSizePx(): number {
    return remSizePx;
  }

  private readonly subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    // this.updateDataOnButtonsArrayChange();
    this.updateButtonsAlwaysVisibleOnButtonsArrayChange();
    this.updateRotationsOnButtonsArraysChanges();
    this.switchDataOnHover();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!Array.isArray(changes.buttons.currentValue) || changes.buttons.currentValue.length === 0) {
      this.allButtons$.next([]);
    }
    this.allButtons$.next(changes.buttons.currentValue);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setPanelExpansionState(isExpanded: string): void {
    this.isPanelExpanded$.next(isExpanded as PanelExpansionState);
  }

  public trackByActionName(index: number, item: WasherButton): string {
    index;
    return item.actionName;
  }

  private updateButtonsAlwaysVisibleOnButtonsArrayChange(): void {
    const buttonsAlwaysVisible$: Observable<WasherButton[]> = this.allButtons$.pipe(
      map((innerButtons: WasherButton[]) => innerButtons.filter(innerButton => innerButton.isAlwaysVisible))
    );
    this.subscription.add(
      buttonsAlwaysVisible$.subscribe((innerButtons: WasherButton[]) => this.alwaysVisibleButtons$.next(innerButtons))
    );
  }

  private updateRotationsOnButtonsArraysChanges(): void {
    const buttonsCount$: Observable<number> = this.allButtons$.pipe(
      map((innerButtons: WasherButton[]) => innerButtons.length)
    );
    const buttonsAlwaysVisibleCount$: Observable<number> = this.alwaysVisibleButtons$.pipe(
      map((innerButtons: WasherButton[]) => innerButtons.length)
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
    const isPanelExpanded$: Observable<boolean> = this.isPanelExpanded$.pipe(
      map((innerState: PanelExpansionState) => innerState === PanelExpansionState.appeared),
      distinctUntilChanged((x: boolean, y: boolean) => x === y)
    );
    const actualButtonsSource$: Observable<WasherButton[]> = combineLatest([
      this.allButtons$,
      this.alwaysVisibleButtons$,
      isPanelExpanded$
    ]).pipe(
      map((innerData: [WasherButton[], WasherButton[], boolean]) =>
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
        innerData[Sources.trigger] ? innerData[Sources.full] - innerData[Sources.filtered] : 0
      )
    );
    this.subscription
      .add(
        actualButtonsSource$.subscribe((innerButtons: WasherButton[]) => {
          console.log(innerButtons);
          this.buttons$.next(innerButtons);
        })
      )
      .add(
        actualRotationsSource$.subscribe((innerRotations: number[]) => {
          this.rotations$.next(innerRotations);
        })
      )
      .add(
        actualBottomMargin$.subscribe((innerMaginValue: number) => {
          this.marginBottom$.next(innerMaginValue);
        })
      );
  }

  // private updateDataOnButtonsArrayChange(): void {
  //   enum MapValue {
  //     buttons,
  //     trigger
  //   }
  //   const debounceTime: number = 100;
  //   const panelExpansionState$: Observable<boolean> = this.isPanelExpanded$.pipe(
  //     debounce(() => timer(debounceTime)),
  //     map((innerValue: PanelExpansionState) => innerValue === PanelExpansionState.appeared)
  //   );
  //   const visibleButtonsCount$: Observable<[number, boolean]> = combineLatest([
  //     this.buttons$,
  //     panelExpansionState$
  //   ]).pipe(
  //     distinctUntilChanged(
  //       (x: [WasherButton[], boolean], y: [WasherButton[], boolean]) => x[MapValue.trigger] === y[MapValue.trigger]
  //     ),
  //     map((innerValue: [WasherButton[], boolean]) =>
  //       innerValue[MapValue.trigger]
  //         ? [innerValue[MapValue.buttons], true]
  //         : [innerValue[MapValue.buttons].filter((innerButton: WasherButton) => innerButton.isAlwaysVisible), false]
  //     ),
  //     map((innerValue: [WasherButton[], boolean]) => [
  //       innerValue[MapValue.buttons].length,
  //       innerValue[MapValue.trigger]
  //     ])
  //   );
  //   const updateContainerWidthSubscription: Subscription = visibleButtonsCount$.subscribe(
  //     (innerValue: [number, boolean]) => {
  //       const innerButtonsCount: number = innerValue[MapValue.buttons];
  //       const safeRatio: number = 1.75;
  //       const arcLengthPx: number = innerButtonsCount * (this.buttonSizePx + this.buttonPaddingPx) * safeRatio;
  //       const resultRadius: number = arcLengthPx / this.angleRad;
  //       this.middleDiskRadiusPx$.next(resultRadius);
  //       console.log(resultRadius);
  //     }
  //   );
  //   const updateRotationsSubscription: Subscription = visibleButtonsCount$.subscribe(
  //     (innerValue: [number, boolean]) => {
  //       const innerButtonsCount: number = innerValue[MapValue.buttons];

  //       const rotationsArray: number[] = this.getRotationsArray(innerButtonsCount);
  //       this.rotations$.next(rotationsArray);
  //     }
  //   );
  //   this.subscription.add(updateContainerWidthSubscription).add(updateRotationsSubscription);
  // }

  private getRotationsArray(elementsCount: number): number[] {
    // tslint:disable no-magic-numbers
    const rotationStepRad: number = this.angleRad / elementsCount;
    // need to rotate whole system
    const wholeSystemRotationRad: number = (Math.PI - this.angleRad) / 2;
    // need to add rotation padding for the 1st element
    const additionalRotationRad: number = rotationStepRad / 2;
    return new Array(elementsCount).fill(null).map((_, index: number) => {
      return index * rotationStepRad + wholeSystemRotationRad + additionalRotationRad;
    });
    // tslint:enable no-magic-numbers
  }

  private getMiddleDiskRadiusPx(buttonsCount: number): number {
    const safeRatio: number = 1.75;
    const arcLengthPx: number = buttonsCount * (this.buttonSizePx + this.buttonPaddingPx) * safeRatio;
    return arcLengthPx / this.angleRad;
  }
}
