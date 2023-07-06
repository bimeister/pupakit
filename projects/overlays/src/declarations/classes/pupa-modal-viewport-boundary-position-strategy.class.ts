import { OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ElementRef, NgZone, Renderer2, RendererFactory2 } from '@angular/core';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { isNil, Nullable, resizeObservable } from '@bimeister/utilities';
import { Position, subscribeOutsideAngular } from '@bimeister/pupakit.common';

import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { ConnectedPositionX } from '../types/connected-position-x.type';
import { ConnectedPositionY } from '../types/connected-position-y.type';

import { switchMap } from 'rxjs/operators';
import { PupaModalViewport } from '../types/pupa-modal-viewport.type';
import { PupaModalViewportRect } from '../interfaces/pupa-modal-viewport-rect.interface';
import { PupaModalViewportAlignmentOptions } from '../interfaces/pupa-modal-viewport-alignment-options.interface';

const boundingBoxClasses: string[] = [
  'cdk-overlay-connected-position-bounding-box',
  'pupa-viewport-position-bounding-box',
];
const overlayClasses: string[] = ['pupa-viewport-position-overlay'];
const backdropClasses: string[] = ['pupa-viewport-position-backdrop'];

const JUSTIFY_CONTENT_FROM_CONNECTED_POSITION: Record<ConnectedPositionX, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
};

const ALIGN_ITEMS_FROM_CONNECTED_POSITION: Record<ConnectedPositionY, string> = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
};

export class PupaModalViewportBoundaryPositionStrategy implements PositionStrategy {
  private readonly renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);

  private isDisposed: boolean = false;

  private viewport: PupaModalViewport;
  private overlayRef: OverlayRef;
  private viewportRect: PupaModalViewportRect;

  private hostElement: Nullable<HTMLElement> = null;
  private backdropElement: Nullable<HTMLElement> = null;
  private overlayElement: Nullable<HTMLElement> = null;

  private overlayX: ConnectedPositionX = 'center';
  private overlayY: ConnectedPositionY = 'center';
  private viewportPadding: number = 0;

  private defaultPosition: Position | null = null;
  private preferredPosition: Position | null = null;

  private overlayStyle: Partial<CSSStyleDeclaration> = {};
  private hostStyle: Partial<CSSStyleDeclaration> = {};
  private backdropStyle: Partial<CSSStyleDeclaration> = {};

  private readonly subscription: Subscription = new Subscription();

  constructor(
    viewport: PupaModalViewport,
    private readonly rendererFactory: RendererFactory2,
    private readonly ngZone: NgZone
  ) {
    this.setViewport(viewport);
  }

  /** Attaches this position strategy to an overlay. */
  public attach(overlayRef: OverlayRef): void {
    this.overlayRef = overlayRef;

    this.hostElement = this.overlayRef.hostElement;
    this.overlayElement = this.overlayRef.overlayElement;
  }

  /** Updates the position of the overlay element. */
  public apply(): void {
    if (this.isDisposed) {
      return;
    }

    this.viewportRect = this.getViewPortRect();

    const scrollSubscription: Subscription = merge(
      fromEvent(window, 'scroll', { capture: true }),
      this.getResizeObserver()
    )
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe(() => {
        this.applyHostPosition();
        this.applyBackdropPosition();
        this.applyOverlayPosition();
      });

    this.subscription.add(scrollSubscription);

    this.backdropElement = this.overlayRef.backdropElement;

    this.hostElement.classList.add(...boundingBoxClasses);
    this.overlayElement.classList.add(...overlayClasses);
    this.backdropElement?.classList.add(...backdropClasses);

    this.applyHostPosition();
    this.applyBackdropPosition();
    this.applyAlignment();
    this.applyViewportPadding();
    this.applyOverlayPosition();

    this.isDisposed = false;
  }

  /** Called when the overlay is detached. */
  public detach(): void {
    this.subscription?.unsubscribe();

    this.hostElement = null;
    this.overlayElement = null;
    this.backdropElement = null;

    this.defaultPosition = null;
    this.preferredPosition = null;
  }

  /** Cleans up any DOM modifications made by the position strategy, if necessary. */
  public dispose(): void {
    this.removeStylesFromElement(this.backdropElement, this.backdropStyle);

    this.detach();
    this.isDisposed = true;
  }

  public setDefaultLocalPosition(position: Position | null): this {
    this.defaultPosition = position;
    return this;
  }

  public setViewportPadding(padding: number): this {
    this.viewportPadding = padding ?? 0;

    this.applyViewportPadding();
    return this;
  }

  public setAlignment(options: PupaModalViewportAlignmentOptions): this {
    this.overlayX = options.overlayX;
    this.overlayY = options.overlayY;

    this.applyAlignment();
    return this;
  }

  public updatePortalPositionWithLocalCoordinates(position: Position | null): void {
    this.preferredPosition = position;
    this.applyOverlayPosition();
  }

  public updatePortalPositionWithClientMouseCoordinates(position: Position | null): void {
    const viewportRect: PupaModalViewportRect = this.getViewPortRect();
    if (!isNil(position)) {
      this.preferredPosition = [position[0] - viewportRect.x, position[1] - viewportRect.y];
    } else {
      this.preferredPosition = position;
    }
    this.applyOverlayPosition();
  }

  private constrainGuard(position: Position): Position {
    const overlayRect: DOMRect = this.overlayElement.getBoundingClientRect();
    const viewportRect: PupaModalViewportRect = this.getViewPortRect();

    const newPosition: Position = [...position];

    const isXLessThenViewportLeftEdge: boolean = position[0] < this.viewportPadding;
    const isYLessThenViewportTopEdge: boolean = position[1] < this.viewportPadding;
    const isXGreaterThenViewportRightEdge: boolean =
      position[0] + overlayRect.width > viewportRect.width - this.viewportPadding;
    const isYGreaterThenViewportBottomEdge: boolean =
      position[1] + overlayRect.height > viewportRect.height - this.viewportPadding;

    if (isXLessThenViewportLeftEdge) {
      newPosition[0] = this.viewportPadding;
    }
    if (isYLessThenViewportTopEdge) {
      newPosition[1] = this.viewportPadding;
    }
    if (isXGreaterThenViewportRightEdge) {
      newPosition[0] = viewportRect.width - overlayRect.width - this.viewportPadding;
    }
    if (isYGreaterThenViewportBottomEdge) {
      newPosition[1] = viewportRect.height - overlayRect.height - this.viewportPadding;
    }

    return newPosition;
  }

  private setViewport(viewport: PupaModalViewport): void {
    this.viewport = viewport;
  }

  private applyHostPosition(): void {
    this.viewportRect = this.getViewPortRect();

    if (!isNil(this.hostElement)) {
      this.hostStyle = {
        left: coerceCssPixelValue(this.viewportRect.x),
        top: coerceCssPixelValue(this.viewportRect.y),
        width: coerceCssPixelValue(this.viewportRect.width),
        height: coerceCssPixelValue(this.viewportRect.height),
      };

      this.applyStylesToElement(this.hostElement, this.hostStyle);
    }
  }

  private applyBackdropPosition(): void {
    if (isNil(this.backdropElement)) {
      return;
    }

    this.backdropStyle = {
      left: coerceCssPixelValue(this.viewportRect.x),
      top: coerceCssPixelValue(this.viewportRect.y),
      width: coerceCssPixelValue(this.viewportRect.width),
      height: coerceCssPixelValue(this.viewportRect.height),
    };

    this.applyStylesToElement(this.backdropElement, this.backdropStyle);
  }

  private applyOverlayPosition(): void {
    const overlayPositionStyle: Partial<CSSStyleDeclaration> = {
      left: '',
      top: '',
    };

    if (isNil(this.preferredPosition) && isNil(this.defaultPosition)) {
      this.removeStylesFromElement(this.overlayElement, overlayPositionStyle);
      return;
    }

    const overlayRect: DOMRect = this.overlayElement.getBoundingClientRect();
    const isDefaultPosition: boolean = isNil(this.preferredPosition) && !isNil(this.defaultPosition);
    const position: Position = this.constrainGuard(isDefaultPosition ? this.defaultPosition : this.preferredPosition);

    let overlayPositionLeft: number = position[0];
    if (this.overlayX === 'end' && isDefaultPosition) {
      overlayPositionLeft = this.viewportRect.width - overlayRect.width - position[0];
    }

    let overlayPositionTop: number = position[1];
    if (this.overlayY === 'bottom' && isDefaultPosition) {
      overlayPositionTop = this.viewportRect.height - overlayRect.height - position[1];
    }

    overlayPositionStyle.left = coerceCssPixelValue(overlayPositionLeft);
    overlayPositionStyle.top = coerceCssPixelValue(overlayPositionTop);

    this.overlayStyle = {
      ...this.overlayStyle,
      ...overlayPositionStyle,
    };

    this.applyStylesToElement(this.overlayElement, this.overlayStyle);
  }

  private applyViewportPadding(): void {
    if (isNil(this.hostElement)) {
      return;
    }

    this.hostStyle = {
      ...this.hostStyle,
      padding: coerceCssPixelValue(this.viewportPadding),
    };

    this.applyStylesToElement(this.hostElement, this.hostStyle);
  }

  private applyAlignment(): void {
    if (isNil(this.hostElement)) {
      return;
    }

    this.hostStyle = {
      ...this.hostStyle,
      justifyContent: JUSTIFY_CONTENT_FROM_CONNECTED_POSITION[this.overlayX],
      alignItems: ALIGN_ITEMS_FROM_CONNECTED_POSITION[this.overlayY],
    };

    this.applyStylesToElement(this.hostElement, this.hostStyle);
  }

  private getViewPortRect(): PupaModalViewportRect {
    if (this.viewport instanceof ElementRef) {
      return this.viewport.nativeElement.getBoundingClientRect();
    }

    if (this.viewport instanceof HTMLElement) {
      return this.viewport.getBoundingClientRect();
    }

    return this.viewport;
  }

  private getResizeObserver(): Observable<ResizeObserverEntry[] | Event> {
    return of(this.viewport).pipe(
      switchMap((viewport: PupaModalViewport) => {
        if (viewport instanceof ElementRef) {
          return resizeObservable(viewport.nativeElement);
        }

        if (viewport instanceof HTMLElement) {
          return resizeObservable(viewport);
        }

        return fromEvent(window, 'resize');
      })
    );
  }

  private applyStylesToElement(destinationElement: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        this.renderer.setStyle(destinationElement, key, styles[key]);
      }
    }
  }

  private removeStylesFromElement(destinationElement: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        this.renderer.removeStyle(destinationElement, key);
      }
    }
  }
}
