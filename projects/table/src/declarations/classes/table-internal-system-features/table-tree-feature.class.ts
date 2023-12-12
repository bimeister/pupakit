import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableFeature } from '../../interfaces/table-feature.interface';
import { QueueEvents } from '@bimeister/pupakit.common';
import { TableBodyTreeNodeRowRef } from '../../interfaces/table-body-row-ref.interface';
import { TableRowEvents } from '../../events/table-row.events';
import { TableFeatureEvents } from '../../events/table-feature.events';


export class TableTreeFeature<T> implements TableFeature {
  private readonly eventBus: EventBus = this.api.eventBus;
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly api: TableApi<T>) {
    this.subscription.add(this.processOuterSetTreeDefinitionsEvent());
    this.subscription.add(this.processCellClick());
  }

  public dispose(): void {
    this.subscription.unsubscribe();
  }

  private processOuterSetTreeDefinitionsEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.SetTreeDefinition),
        tap((event: TableEvents.SetTreeDefinition) => {
          this.api.displayData.setTreeDefinition(event.definition);
        })
      )
      .subscribe((event: TableEvents.SetTreeDefinition) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private processCellClick(): Subscription {
    return this.eventBus
      .listen()
      .pipe(filterByInstanceOf(TableEvents.CellClick), withLatestFrom(this.api.displayData.bodyRowIdToBodyRowMap$))
      .subscribe(([event, bodyRowIdToBodyRowMap]: [TableEvents.CellClick, Map<string, TableBodyTreeNodeRowRef<T>>]) => {
        const isExpanderClick: boolean = this.isExpanderClick(event.targetCell.srcEvent);

        if (!isExpanderClick) return;

        const row: TableBodyTreeNodeRowRef<T> = bodyRowIdToBodyRowMap.get(event.targetCell.rowId);
        const nextExtendedState: boolean = !row.isExpanded;

        row.eventBus.dispatch(new TableRowEvents.ExpandChanged(nextExtendedState));
        this.eventBus.dispatch(new TableFeatureEvents.ExpandRowChanged({ rowId: row.id, expanded: nextExtendedState }));
      });
  }

  private isExpanderClick(event: Event): boolean {
    const eventPath: EventTarget[] = event.composedPath();
    return eventPath.some((eventTarget: HTMLElement) =>
      eventTarget.classList?.contains('table-body-tree-cell-container__expander')
    );
  }
}
