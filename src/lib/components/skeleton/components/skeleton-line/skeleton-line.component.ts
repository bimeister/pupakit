import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-skeleton-line',
  templateUrl: './skeleton-line.component.html',
  styleUrls: ['./skeleton-line.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonLineComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() public width: string | null = null;
  // tslint:disable: no-input-rename
  @Input('width.%') public widthPercents: number | null = null;
  @Input('width.px') public widthPx: number | null = null;
  @Input('width.vw') public widthVw: number | null = null;
  @Input('width.rem') public widthRem: number | null = null;
  // tslint:enable: no-input-rename

  @HostBinding('style.width') public widthStyle: SafeStyle;

  public readonly width$: BehaviorSubject<SafeStyle | null> = new BehaviorSubject<SafeStyle | null>(null);

  private readonly subscription: Subscription = new Subscription();

  private isDestroyed: boolean = true;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef, private readonly domSanitizer: DomSanitizer) {
    this.changeDetectorRef.detach();
  }

  public ngOnInit(): void {
    this.isDestroyed = false;
    this.subscription.add(this.detectChangesOnWidthChanges()).add(this.updateHostWidthOnWidthChanges());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.processWidthChanges(changes?.width);
    this.processWidthPercentChanges(changes.widthPercents);
    this.processWidthPxChanges(changes.widthPx);
    this.processWidthVwChanges(changes.widthVw);
    this.processWidthRemChanges(changes.widthRem);
  }

  public ngAfterViewInit(): void {
    this.detectChanges();
  }

  public ngOnDestroy(): void {
    this.isDestroyed = true;
    this.subscription.unsubscribe();
  }

  private processWidthChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateWidth(`${change?.currentValue}`);
  }

  private processWidthPercentChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateWidth(`${change?.currentValue}%`);
  }

  private processWidthPxChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateWidth(`${change?.currentValue}px`);
  }

  private processWidthVwChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateWidth(`${change?.currentValue}vw`);
  }

  private processWidthRemChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.updateWidth(`${change?.currentValue}rem`);
  }

  private updateWidth(widthStyle: string): void {
    const safeStyle: SafeStyle = this.domSanitizer.bypassSecurityTrustStyle(widthStyle);
    if (isNullOrUndefined(safeStyle)) {
      return;
    }
    this.width$.next(safeStyle);
  }

  private detectChangesOnWidthChanges(): Subscription {
    return this.width$.pipe(distinctUntilChanged()).subscribe(() => {
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
