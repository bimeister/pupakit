import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ComponentDrawerData, DrawersService } from '../drawers.service';
import { isNullOrUndefined } from './../../../../helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-layout-drawer',
  templateUrl: './layout-drawer.component.html',
  styleUrls: ['./layout-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutDrawerComponent implements AfterViewInit, OnDestroy {
  @Input()
  public readonly componentDrawerData: ComponentDrawerData;

  public drawerExpanded: boolean = false;

  private isStarted: boolean = true;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly drawersService: DrawersService, private readonly changeDetector: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.drawerExpanded = true;
    this.changeDetector.detectChanges();
    if (!this.componentDrawerData.destroyContentOnClose) {
      this.subscription
        .add(
          this.drawersService.isOpen(this.componentDrawerData.id, this.drawerExpanded).subscribe(() => {
            this.drawerExpanded = true;
            this.changeDetector.detectChanges();
          })
        )
        .add(
          this.drawersService.isClosed(this.componentDrawerData.id, this.drawerExpanded).subscribe(() => {
            this.drawerExpanded = false;
            this.changeDetector.detectChanges();
          })
        );
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public processOverlayClick(): void {
    if (isNullOrUndefined(this.componentDrawerData.clickableOverlay) || !this.componentDrawerData.clickableOverlay) {
      return;
    }
    this.closeDrawer();
  }

  public closeDrawer(): void {
    this.isStarted = false;
    this.drawerExpanded = false;
    this.changeDetector.detectChanges();
  }

  public animationDone(animationDone: boolean): void {
    if (!animationDone || this.isStarted || !this.componentDrawerData.destroyContentOnClose) {
      return;
    }
    this.drawersService.destroyDrawerById(this.componentDrawerData.id);
  }
}
