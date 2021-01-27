import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { PagedVirtualScrollStateService } from '../../services/paged-virtual-scroll-state.service';
import { getUuid } from '@bimeister/utilities';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';

@Component({
  selector: 'pupa-paged-virtual-scroll-item',
  templateUrl: './paged-virtual-scroll-item.component.html',
  styleUrls: ['./paged-virtual-scroll-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class PagedVirtualScrollItemComponent implements AfterViewInit, OnDestroy {
  private readonly itemId: Uuid = getUuid();
  private readonly virtualScrollItemSizesMap: Map<Uuid, ClientRect> = this.pagedVirtualScrollStateService
    .virtualScrollItemSizesMap;

  constructor(
    private readonly pagedVirtualScrollStateService: PagedVirtualScrollStateService,
    private readonly hostElement: ElementRef<HTMLElement>
  ) {}

  public ngAfterViewInit(): void {
    this.cacheItemSizes();
  }

  public ngOnDestroy(): void {
    this.virtualScrollItemSizesMap.delete(this.itemId);
  }

  private cacheItemSizes(): void {
    const size: ClientRect = this.hostElement.nativeElement.getBoundingClientRect();
    this.virtualScrollItemSizesMap.set(this.itemId, size);
  }
}
