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
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { UnitHeightStyleChangesProcessor } from '../../../../../internal/declarations/classes/unit-height-style-changes-processor.class';
import { UnitWidthStyleChangesProcessor } from '../../../../../internal/declarations/classes/unit-width-style-changes-processor.class';
import { HeightUnitBinding } from '../../../../../internal/declarations/interfaces/height-unit-binding.interface';
import { WidthUnitBinding } from '../../../../../internal/declarations/interfaces/width-unit-binding.interface';

/** @dynamic */
@Component({
  selector: 'pupa-expansible',
  templateUrl: './expansible.component.html',
  styleUrls: ['./expansible.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansibleComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy, WidthUnitBinding, HeightUnitBinding {
  private readonly widthChangesProcessor: UnitWidthStyleChangesProcessor = new UnitWidthStyleChangesProcessor(
    this.domSanitizer
  );
  private readonly heightChangesProcessor: UnitHeightStyleChangesProcessor = new UnitHeightStyleChangesProcessor(
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
  @HostBinding('style.width') public widthStyle: SafeStyle;
  @HostBinding('style.height') public heightStyle: SafeStyle;

  public readonly width$: Observable<SafeStyle> = this.widthChangesProcessor.safeStyle$;
  public readonly height$: Observable<SafeStyle> = this.heightChangesProcessor.safeStyle$;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef, private readonly domSanitizer: DomSanitizer) {}

  public ngOnInit(): void {
    this.subscription.add(this.updateHostWidthOnWidthChanges()).add(this.updateHostHeightOnHeightChanges());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.heightChangesProcessor.process(changes);
    this.widthChangesProcessor.process(changes);
  }

  public ngAfterViewInit(): void {
    this.markForCheck();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  private markForCheck(): void {
    this.changeDetectorRef.markForCheck();
  }
}
