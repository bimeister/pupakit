import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Injector } from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { ScrollableComponent } from '@bimeister/pupakit.kit';
import { TableDataDisplayCollectionRef } from './table-data-display-collection-ref.interface';
import { TableTemplatesRegistry } from './tables-templates-registry.interface';

export interface TableApi<T> {
  readonly eventBus: EventBus;
  readonly tableInjector: Injector;
  readonly tableElement: HTMLElement;
  readonly displayData: TableDataDisplayCollectionRef<T>;
  readonly bodyScrollableContainerRef: ScrollableComponent;
  readonly cdkVirtualScrollViewportRef: CdkVirtualScrollViewport;
  readonly templatesRegistry: TableTemplatesRegistry<T>;
}
