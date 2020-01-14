import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { ComponentDrawerData, DrawersService } from '../drawers.service';
import { isNullOrUndefined } from './../../../../helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-layout-drawer',
  templateUrl: './layout-drawer.component.html',
  styleUrls: ['./layout-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutDrawerComponent implements AfterViewInit {
  @Input()
  public readonly componentDrawerData: ComponentDrawerData;

  public drawerExpanded: string = 'false';

  private start: boolean = true;

  constructor(private readonly drawersService: DrawersService, private readonly changeDetector: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.drawerExpanded = 'true';
    this.changeDetector.detectChanges();
  }

  public processOverlayClick(): void {
    if (isNullOrUndefined(this.componentDrawerData.clickableOverlay) || !this.componentDrawerData.clickableOverlay) {
      return;
    }
    this.closeDrawer();
  }

  public closeDrawer(): void {
    this.start = false;
    this.drawerExpanded = 'false';
    this.changeDetector.detectChanges();
  }

  public animationDone(animationDone: boolean): void {
    if (!animationDone || this.start) {
      return;
    }
    this.drawersService.closeDrawerById(this.componentDrawerData.id);
  }
}
