import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ComponentDrawerData, DrawersService } from '../drawers.service';
import { isNullOrUndefined } from './../../helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-drawer-pane',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('drawerExpanded', [
      state('false', style({ width: `0` })),
      state('true', style({ width: `*` })),
      transition('false => true', animate('0.32s cubic-bezier(0.97, 0.84, .03, 0.95)')),
      transition('true => false', animate('0.2s ease-in-out'))
    ])
  ]
})
export class DrawerComponent implements AfterViewInit, OnDestroy {
  @Input()
  public readonly componentDrawerData: ComponentDrawerData;

  public isVisible: boolean = false;

  private isStarted: boolean = true;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly drawersService: DrawersService, private readonly changeDetector: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.isVisible = true;
    this.changeDetector.detectChanges();
    if (!this.componentDrawerData.destroyContentOnClose) {
      this.subscription
        .add(
          this.drawersService.isOpen(this.componentDrawerData.id, this.isVisible).subscribe(() => {
            this.isVisible = true;
            this.changeDetector.detectChanges();
          })
        )
        .add(
          this.drawersService.isClosed(this.componentDrawerData.id, this.isVisible).subscribe(() => {
            this.isVisible = false;
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
    this.isVisible = false;
    this.changeDetector.detectChanges();
  }

  public animationDone(animationDone: boolean): void {
    if (!animationDone || this.isStarted || !this.componentDrawerData.destroyContentOnClose) {
      return;
    }
    this.drawersService.destroyDrawerById(this.componentDrawerData.id);
  }

  public processAnimationEnd(event: AnimationEvent): void {
    const animationDone: boolean = String(event.toState) === 'false';
    if (!animationDone) {
      return;
    }
    this.animationDone(animationDone);
  }
}
