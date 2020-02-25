import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ComponentDrawerData } from '../../../../../internal/declarations/interfaces/component-drawer-data.interface';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';
import { DrawersService } from '../../services/drawers.service';

@Component({
  selector: 'pupa-drawer-pane',
  templateUrl: './drawer-pane.component.html',
  styleUrls: ['./drawer-pane.component.scss'],
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
export class DrawerPaneComponent implements AfterViewInit, OnDestroy {
  @Input()
  public readonly componentDrawerData: ComponentDrawerData;

  @ViewChild('container', { read: ViewContainerRef, static: true })
  public readonly container: ViewContainerRef;

  public isVisible: boolean = false;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly drawersService: DrawersService, private readonly changeDetector: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.container.createComponent(this.componentDrawerData.componentFactory, 0, this.componentDrawerData.injector);
    this.isVisible = true;
    this.changeDetector.detectChanges();
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
    this.isVisible = false;
    this.changeDetector.detectChanges();
  }

  public animationDone(animationDone: boolean): void {
    if (!animationDone || !this.componentDrawerData.destroyContentOnClose) {
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
