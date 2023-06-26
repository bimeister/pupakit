import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Host,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ComponentChanges, UnitWidthStyleChangesProcessor, WidthUnitBinding } from '@bimeister/pupakit.common';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'pupa-skeleton-line',
  templateUrl: './skeleton-line.component.html',
  styleUrls: ['./skeleton-line.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLineComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy, WidthUnitBinding {
  private readonly unitWidthStyleChangesProcessor: UnitWidthStyleChangesProcessor<this> =
    new UnitWidthStyleChangesProcessor(this.domSanitizer);

  @Input() public width: string | null = null;
  /* eslint-disable @angular-eslint/no-input-rename */
  @Input('width.%') public widthPercents: number | null = null;
  @Input('width.px') public widthPx: number | null = null;
  @Input('width.vw') public widthVw: number | null = null;
  @Input('width.rem') public widthRem: number | null = null;
  /* eslint-enable @angular-eslint/no-input-rename */
  @Input() public hasMarginLeft: boolean = true;

  @HostBinding('style.width') public widthStyle: SafeStyle;

  private readonly width$: Observable<SafeStyle> = this.unitWidthStyleChangesProcessor.safeStyle$;

  private readonly subscription: Subscription = new Subscription();

  private isDestroyed: boolean = true;

  public readonly isActive$: Observable<boolean> = this.skeletonComponent.isActive$;

  constructor(
    @Optional() @Host() private readonly skeletonComponent: SkeletonComponent,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly domSanitizer: DomSanitizer
  ) {
    this.changeDetectorRef.detach();
  }

  public ngOnInit(): void {
    this.isDestroyed = false;
    this.subscription.add(this.detectChangesOnIsActiveValueChanges()).add(this.updateHostWidthOnWidthChanges());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.unitWidthStyleChangesProcessor.process(changes);
  }

  public ngAfterViewInit(): void {
    this.detectChanges();
  }

  public ngOnDestroy(): void {
    this.isDestroyed = true;
    this.subscription.unsubscribe();
  }

  private detectChangesOnIsActiveValueChanges(): Subscription {
    return this.isActive$.pipe(distinctUntilChanged()).subscribe(() => {
      this.detectChanges();
    });
  }

  private updateHostWidthOnWidthChanges(): Subscription {
    return this.width$.pipe(distinctUntilChanged()).subscribe((widthStyle: SafeStyle) => {
      this.widthStyle = widthStyle;
    });
  }

  private detectChanges(): void {
    if (!this.isDestroyed) {
      this.changeDetectorRef.detectChanges();
    }
  }
}
