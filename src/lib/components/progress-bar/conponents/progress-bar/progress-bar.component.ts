import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';

interface CalculatedParameters {
  radius: number;
  innerRadius: number;
  strokeDashArray: number;
  strokeDashOffset: number;
}

@Component({
  selector: 'pupa-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('progressBar') public readonly progressBarRef: ElementRef<SVGElement>;
  @ViewChild('mainCircle') public readonly mainCircleRef: ElementRef<SVGCircleElement>;
  @ViewChild('progressCircle') public readonly progressCircleRef: ElementRef<SVGCircleElement>;

  @Input() public sizePx: number = 64;
  private readonly sizePx$: BehaviorSubject<number> = new BehaviorSubject(64);

  @Input() public strokeWidthPx: number = 16;
  private readonly strokeWidthPx$: BehaviorSubject<number> = new BehaviorSubject(16);

  @Input() public percentage: number = 0;
  private readonly percentage$: BehaviorSubject<number> = new BehaviorSubject(0);

  private readonly calculatedParameters$: Observable<CalculatedParameters> = combineLatest([
    this.sizePx$,
    this.strokeWidthPx$,
    this.percentage$
  ]).pipe(
    map(
      ([sizePx, strokeWidthPx, percentage]: [number, number, number]): CalculatedParameters => {
        const radius: number = sizePx / 2;
        const innerRadius: number = radius - strokeWidthPx / 2;
        const strokeDashArray: number = innerRadius * Math.PI * 2;

        const normalizedPercentage: number = percentage / 100;
        const strokeDashOffset: number = strokeDashArray * (1 - normalizedPercentage);

        return {
          radius,
          innerRadius,
          strokeDashArray,
          strokeDashOffset
        };
      }
    )
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly renderer: Renderer2) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processSizePxChanges(changes.sizePx);
    this.processStrokeWidthPxChanges(changes.strokeWidthPx);
    this.processPercentageChanges(changes.percentage);
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.processParametersChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processSizePxChanges(change: ComponentChange<this, number>): void {
    const sizePx: number | undefined = change?.currentValue;

    if (isNil(sizePx)) {
      return;
    }

    this.sizePx$.next(sizePx);
  }

  private processStrokeWidthPxChanges(change: ComponentChange<this, number>): void {
    const strokeWidthPx: number | undefined = change?.currentValue;

    if (isNil(strokeWidthPx)) {
      return;
    }

    this.strokeWidthPx$.next(strokeWidthPx);
  }

  private processPercentageChanges(change: ComponentChange<this, number>): void {
    const percentage: number | undefined = change?.currentValue;

    if (isNil(percentage)) {
      return;
    }

    this.percentage$.next(percentage);
  }

  private processParametersChanges(): Subscription {
    return this.calculatedParameters$.subscribe((calculatedParameters: CalculatedParameters) => {
      this.setProgressBarSize();
      this.setMainCircleSize(calculatedParameters);
      this.setProgressCircleSize(calculatedParameters);
    });
  }

  private setProgressBarSize(): void {
    const progressBarElement: SVGElement = this.progressBarRef.nativeElement;
    this.renderer.setAttribute(progressBarElement, 'width', this.sizePx.toString());
    this.renderer.setAttribute(progressBarElement, 'height', this.sizePx.toString());
  }

  private setMainCircleSize(calculatedParameters: CalculatedParameters): void {
    const mainCircleElement: SVGCircleElement = this.mainCircleRef.nativeElement;
    this.renderer.setAttribute(mainCircleElement, 'cx', calculatedParameters.radius.toString());
    this.renderer.setAttribute(mainCircleElement, 'cy', calculatedParameters.radius.toString());
    this.renderer.setAttribute(mainCircleElement, 'r', calculatedParameters.innerRadius.toString());
    this.renderer.setAttribute(mainCircleElement, 'stroke-width', this.strokeWidthPx.toString());
  }

  private setProgressCircleSize(calculatedParameters: CalculatedParameters): void {
    const progressCircleElement: SVGCircleElement = this.progressCircleRef.nativeElement;
    this.renderer.setAttribute(progressCircleElement, 'cx', calculatedParameters.radius.toString());
    this.renderer.setAttribute(progressCircleElement, 'cy', calculatedParameters.radius.toString());
    this.renderer.setAttribute(progressCircleElement, 'r', calculatedParameters.innerRadius.toString());
    this.renderer.setAttribute(progressCircleElement, 'stroke-width', this.strokeWidthPx.toString());
    this.renderer.setAttribute(
      progressCircleElement,
      'stroke-dasharray',
      calculatedParameters.strokeDashArray.toString()
    );
    this.renderer.setAttribute(
      progressCircleElement,
      'stroke-dashoffset',
      calculatedParameters.strokeDashOffset.toString()
    );
  }
}
