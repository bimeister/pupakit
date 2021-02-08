import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VirtualScrollViewportComponent } from '../../../../internal/declarations/interfaces/virtual-scroll-viewport-component.interface';

@Injectable({ providedIn: 'any' })
export class PagedVirtualScrollStateService {
  public readonly viewport$: BehaviorSubject<VirtualScrollViewportComponent> = new BehaviorSubject<VirtualScrollViewportComponent>(
    null
  );

  public setViewportComponent(viewport: VirtualScrollViewportComponent): void {
    this.viewport$.next(viewport);
  }
}
