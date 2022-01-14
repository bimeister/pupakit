import { FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, TemplateRef } from '@angular/core';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { asyncScheduler, BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, observeOn, take, takeWhile, withLatestFrom } from 'rxjs/operators';

export abstract class DropdownBase<ContainerComponent extends unknown> {
  protected readonly triggerRef$: BehaviorSubject<Nullable<ElementRef<HTMLElement>>> = new BehaviorSubject<
    Nullable<ElementRef<HTMLElement>>
  >(null);

  private readonly isOpenState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isOpen$: Observable<boolean> = this.isOpenState$.pipe(distinctUntilChanged());

  private readonly contentTemplateState$: BehaviorSubject<Nullable<TemplateRef<unknown>>> = new BehaviorSubject<
    Nullable<TemplateRef<unknown>>
  >(null);
  public readonly contentTemplate$: Observable<Nullable<TemplateRef<unknown>>> = this.contentTemplateState$.pipe(
    distinctUntilChanged()
  );

  private readonly overlayRef$: BehaviorSubject<Nullable<OverlayRef>> = new BehaviorSubject<Nullable<OverlayRef>>(null);

  protected constructor(protected readonly overlay: Overlay, @Inject(DOCUMENT) private readonly document: Document) {}

  protected abstract getPositionStrategy(): Observable<FlexibleConnectedPositionStrategy>;

  protected abstract getComponentPortal(): ComponentPortal<ContainerComponent>;

  public setIsOpen(isOpen: boolean): void {
    this.isOpenState$
      .pipe(
        take(1),
        filter((currentOpenState: boolean) => currentOpenState !== isOpen)
      )
      .subscribe(() => (isOpen ? this.open() : this.close()));
  }

  public setContentTemplate(template: TemplateRef<unknown>): void {
    this.contentTemplateState$.next(template);
  }

  public setTriggerRef(triggerRef: ElementRef<HTMLElement>): void {
    this.triggerRef$.next(triggerRef);
  }

  private open(): void {
    this.createOverlay();
    this.overlayRef$
      .pipe(
        takeWhile((overlayRef: OverlayRef) => !isNil(overlayRef)),
        take(1)
      )
      .subscribe((overlayRef: OverlayRef) => {
        overlayRef.attach(this.getComponentPortal());
        overlayRef.updatePosition();
        this.closeOnClickOutside(overlayRef);
        this.isOpenState$.next(true);

        this.listenOutsideEventsForClose();
      });
  }

  private close(): void {
    this.overlayRef$
      .pipe(
        takeWhile((overlayRef: OverlayRef) => !isNil(overlayRef)),
        take(1)
      )
      .subscribe((overlayRef: OverlayRef) => {
        this.isOpenState$.next(false);
        overlayRef.dispose();
        overlayRef.detach();
        this.overlayRef$.next(null);
      });
  }

  private closeOnClickOutside(overlayRef: OverlayRef): void {
    overlayRef
      .outsidePointerEvents()
      .pipe(
        take(1),
        observeOn(asyncScheduler),
        withLatestFrom(this.isOpenState$),
        filter(([, isOpen]: [MouseEvent, boolean]) => isOpen)
      )
      .subscribe(() => {
        this.close();
      });
  }

  private createOverlay(): void {
    this.getPositionStrategy()
      .pipe(take(1), filterNotNil())
      .subscribe((positionStrategy: FlexibleConnectedPositionStrategy) => {
        const overlayConfig: OverlayConfig = new OverlayConfig({
          positionStrategy,
        });
        const overlayRef: OverlayRef = this.overlay.create(overlayConfig);
        this.overlayRef$.next(overlayRef);
      });
  }

  private listenOutsideEventsForClose(): void {
    const mouseDown$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'mousedown');
    const touchMove$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'touchmove');
    const wheel$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'wheel');
    const resize$: Observable<MouseEvent> = fromEvent<MouseEvent>(window, 'resize');

    merge(mouseDown$, touchMove$, wheel$, resize$)
      .pipe(take(1))
      .subscribe(() => this.close());
  }
}
