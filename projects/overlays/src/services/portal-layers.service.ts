import { Injectable } from '@angular/core';
import { PortalLayer } from '../declarations/interfaces/portal-layer.interface';
import { isNil, Nullable } from '@bimeister/utilities';

interface PortalLayerLinks {
  current: PortalLayer;
  prev: Nullable<PortalLayerLinks>;
  next: Nullable<PortalLayerLinks>;
}

const DEFAULT_Z_INDEX: number = 1000;
const MAX_Z_INDEX: number = 1999;

@Injectable({ providedIn: 'root' })
export class PortalLayersService {
  private topPortalLayerLinks: Nullable<PortalLayerLinks> = null;
  private readonly portalLayerLinksMap: Map<string, PortalLayerLinks> = new Map<string, PortalLayerLinks>();

  public getTopLayer(): Nullable<PortalLayer> {
    return this.topPortalLayerLinks?.current ?? null;
  }

  public getLayerById(portalLayerId: string): Nullable<PortalLayer> {
    return this.portalLayerLinksMap.get(portalLayerId)?.current ?? null;
  }

  public getLayersFromTopToBottom(): PortalLayer[] {
    const layerLinksList: PortalLayerLinks[] = this.getLayerLinksFromTargetToBottom(this.topPortalLayerLinks);
    return layerLinksList.map((layerLinks: PortalLayerLinks) => layerLinks.current);
  }

  public register(portalLayer: PortalLayer): void {
    const newPortalLayerLinks: PortalLayerLinks = {
      current: portalLayer,
      prev: null,
      next: null,
    };
    this.portalLayerLinksMap.set(portalLayer.id, newPortalLayerLinks);
  }

  public removeById(portalLayerId: string): void {
    const targetPortalLayerLinks: Nullable<PortalLayerLinks> = this.portalLayerLinksMap.get(portalLayerId);

    if (isNil(targetPortalLayerLinks)) {
      return;
    }

    const targetNext: Nullable<PortalLayerLinks> = targetPortalLayerLinks.next;
    const targetPrev: Nullable<PortalLayerLinks> = targetPortalLayerLinks.prev;

    if (!isNil(targetNext)) {
      targetNext.prev = targetPrev;
    }
    if (!isNil(targetPrev)) {
      targetPrev.next = targetNext;
    }

    if (this.topPortalLayerLinks === targetPortalLayerLinks) {
      this.topPortalLayerLinks = targetPrev;
    }
    this.portalLayerLinksMap.delete(portalLayerId);
  }

  public moveToTopById(portalLayerId: string): void {
    const targetPortalLayerLinks: Nullable<PortalLayerLinks> = this.portalLayerLinksMap.get(portalLayerId);

    if (isNil(targetPortalLayerLinks)) {
      return;
    }

    if (this.topPortalLayerLinks === targetPortalLayerLinks) {
      return;
    }

    const topPortalLayer: Nullable<PortalLayer> = this.topPortalLayerLinks?.current;
    const targetPortalLayer: Nullable<PortalLayer> = targetPortalLayerLinks.current;

    const topPortalLayerZIndex: number = topPortalLayer?.getCurrentZIndex() ?? DEFAULT_Z_INDEX - 1;

    const targetNext: Nullable<PortalLayerLinks> = targetPortalLayerLinks.next;
    const targetPrev: Nullable<PortalLayerLinks> = targetPortalLayerLinks.prev;

    if (!isNil(targetNext)) {
      targetNext.prev = targetPrev;
    }
    if (!isNil(targetPrev)) {
      targetPrev.next = targetNext;
    }

    if (!isNil(this.topPortalLayerLinks)) {
      this.topPortalLayerLinks.next = targetPortalLayerLinks;
    }
    targetPortalLayerLinks.prev = this.topPortalLayerLinks;
    targetPortalLayerLinks.next = null;
    this.topPortalLayerLinks = targetPortalLayerLinks;

    targetPortalLayer.moveToZIndex(topPortalLayerZIndex + 1);

    if (targetPortalLayer.getCurrentZIndex() >= MAX_Z_INDEX) {
      this.normalizeZIndexes();
    }
  }

  private getLayerLinksFromTargetToBottom(layerLink: Nullable<PortalLayerLinks>): PortalLayerLinks[] {
    if (isNil(layerLink)) {
      return [];
    }

    return [layerLink, ...this.getLayerLinksFromTargetToBottom(layerLink.prev)];
  }

  private normalizeZIndexes(): void {
    const portalLayerFromBottomToTop: PortalLayer[] = this.getLayersFromTopToBottom().reverse();
    portalLayerFromBottomToTop.forEach((portalLayer: PortalLayer, index: number) =>
      portalLayer.moveToZIndex(index + DEFAULT_Z_INDEX)
    );
  }
}
