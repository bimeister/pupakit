import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

import { LayoutService } from './../../services/layout.service';

export type ScrollingMode = 'enabled' | 'disabled';
export type OverlayMode = 'enabled' | 'disabled';

@Component({
  selector: 'pupa-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  public isScrollingEnabled: boolean = true;
  public isOverlayVisible: boolean = false;

  constructor(private readonly layoutService: LayoutService, private readonly changeDetectorRef: ChangeDetectorRef) {
    this.initializeLayoutService();
  }

  private initializeLayoutService(): void {
    this.layoutService.attachComponent(this);
  }

  public setScrollingMode(mode: ScrollingMode): void {
    this.isScrollingEnabled = mode === 'enabled';
    this.changeDetectorRef.markForCheck();
  }

  public setOverlayMode(mode: OverlayMode): void {
    this.isOverlayVisible = mode === 'enabled';
    this.changeDetectorRef.markForCheck();
  }
}
