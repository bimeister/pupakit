import { Injectable } from '@angular/core';

import { LayoutComponent, OverlayMode, ScrollingMode } from './../components/layout/layout.component';

@Injectable()
export class LayoutService {
  private layoutComponent: Readonly<LayoutComponent>;

  public attachComponent(component: LayoutComponent): void {
    this.layoutComponent = component;
  }

  public setScrollingMode(mode: ScrollingMode): this {
    this.layoutComponent.setScrollingMode(mode);
    return this;
  }

  public setOverlayMode(mode: OverlayMode): this {
    this.layoutComponent.setOverlayMode(mode);
    return this;
  }
}
