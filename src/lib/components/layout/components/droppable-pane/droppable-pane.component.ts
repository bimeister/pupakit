import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { DroppableConfig } from '../../../../../internal/declarations/interfaces/droppable-config.interface';
import { EventUnlistener } from '../../../../../internal/declarations/types/event-unlistener.type';
import { DroppableService } from '../../services/droppable.service';

@Component({
  selector: 'pupa-droppable-pane',
  templateUrl: './droppable-pane.component.html',
  styleUrls: ['./droppable-pane.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('150ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class DroppablePaneComponent implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly isOpened$: Observable<boolean> = this.droppableService.isOpened$;
  public readonly droppableContent$: Observable<DroppableConfig> = this.droppableService.droppableContent$;
  private readonly eventUnlisteners: Set<EventUnlistener> = new Set<EventUnlistener>();

  @ViewChild('content', { static: false }) public contentRef: ElementRef<HTMLElement>;
  @ViewChild('clickEventContainer', { static: false }) public clickEventContainerRef: ElementRef<HTMLElement>;

  constructor(private readonly droppableService: DroppableService, private readonly renderer: Renderer2) {
    this.subscription.add(this.handleIsOpenedChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('window:mousedown')
  @HostListener('window:wheel')
  public closeOnOuterEvents(): void {
    this.droppableService.close();
  }

  private handleIsOpenedChanges(): Subscription {
    return this.isOpened$.subscribe((isOpened: boolean) => {
      if (isOpened) {
        this.listenEventsAndSetPosition();
        return;
      }
      this.unlistenEvents();
    });
  }

  private listenEventsAndSetPosition(): void {
    this.droppableContent$.pipe(take(1)).subscribe((droppableContent: DroppableConfig) => {
      window.requestAnimationFrame(() => {
        this.eventUnlisteners
          .add(this.listenContentMouseDown())
          .add(this.listenContentWheel())
          .add(this.listenClickEventContainerClick(droppableContent.closeOnContentClick));

        const triggerClientRect: ClientRect = droppableContent.triggerRef.nativeElement.getBoundingClientRect();
        const contentClientRect: ClientRect = this.contentRef.nativeElement.getBoundingClientRect();

        let contentOffsetLeft: number = triggerClientRect.left;
        let contentOffsetTop: number = triggerClientRect.top + triggerClientRect.height + DroppablePaneComponent.offset;

        if (DroppablePaneComponent.rightScreenSideOverflow(triggerClientRect, contentClientRect)) {
          contentOffsetLeft = triggerClientRect.left + triggerClientRect.width - contentClientRect.width;
        }

        if (DroppablePaneComponent.bottomScreenSideOverflow(triggerClientRect, contentClientRect)) {
          contentOffsetTop =
            triggerClientRect.top + triggerClientRect.height - DroppablePaneComponent.offset - contentClientRect.height;
        }

        if (DroppablePaneComponent.leftScreenSideOverflow(contentOffsetLeft)) {
          contentOffsetLeft = window.innerWidth - DroppablePaneComponent.offset - contentClientRect.width;
        }

        if (DroppablePaneComponent.topScreenSideOverflow(contentOffsetTop)) {
          contentOffsetTop = DroppablePaneComponent.offset;
        }

        this.renderer.setStyle(this.contentRef.nativeElement, 'left', `${contentOffsetLeft}px`);
        this.renderer.setStyle(this.contentRef.nativeElement, 'top', `${contentOffsetTop}px`);
      });
    });
  }

  private listenContentMouseDown(): EventUnlistener {
    return this.renderer.listen(this.contentRef.nativeElement, 'mousedown', (event: MouseEvent) => {
      event.stopPropagation();
    });
  }

  private listenContentWheel(): EventUnlistener {
    return this.renderer.listen(this.contentRef.nativeElement, 'wheel', (event: MouseEvent) => {
      event.stopPropagation();
    });
  }

  private listenClickEventContainerClick(closeOnContentClick: boolean): EventUnlistener {
    return this.renderer.listen(this.clickEventContainerRef.nativeElement, 'click', () => {
      if (closeOnContentClick) {
        this.droppableService.close();
      }
    });
  }

  private unlistenEvents(): void {
    this.eventUnlisteners.forEach((unlistener: EventUnlistener) => unlistener());
    this.eventUnlisteners.clear();
  }

  private static readonly offset: number = 4;

  private static rightScreenSideOverflow(triggerClientRect: ClientRect, contentClientRect: ClientRect): boolean {
    return triggerClientRect.left + contentClientRect.width > window.innerWidth;
  }

  private static bottomScreenSideOverflow(triggerClientRect: ClientRect, contentClientRect: ClientRect): boolean {
    return (
      triggerClientRect.top + triggerClientRect.height + DroppablePaneComponent.offset + contentClientRect.height >
      window.innerHeight
    );
  }

  private static leftScreenSideOverflow(contentOffsetLeft: number): boolean {
    return contentOffsetLeft < DroppablePaneComponent.offset;
  }

  private static topScreenSideOverflow(contentOffsetTop: number): boolean {
    return contentOffsetTop < DroppablePaneComponent.offset;
  }
}
