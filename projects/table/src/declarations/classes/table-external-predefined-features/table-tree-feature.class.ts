import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableFeature } from '../../interfaces/table-feature.interface';
import { TableFeatureEvents } from '../../events/table-feature.events';
import { isTreeExpander } from '../../../declarations/type-guards/is-tree-expander.type-guard';
import { TableColumn } from '../table-column.class';
import { TableBodyRow } from '../table-body-row.class';
import { hasTreeDefinition } from '../../../declarations/type-guards/is-tree-definition.type-guard';
import { TableTreeDefinition } from '../../../declarations/interfaces/table-tree-definition.interface';

export class TableTreeFeature<T> implements TableFeature {
  private readonly eventBus: EventBus = this.api.eventBus;
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly api: TableApi<T>) {
    this.subscription.add(this.processCellClick());
  }

  public dispose(): void {
    this.subscription.unsubscribe();
  }

  private processCellClick(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.CellClick),
        withLatestFrom(this.api.displayData.columnIdToColumnMap$, this.api.displayData.bodyRowIdToBodyRowMap$)
      )
      .subscribe(
        ([event, columnIdToColumnMap, bodyRowIdToBodyRowMap]: [
          TableEvents.CellClick,
          Map<string, TableColumn>,
          Map<string, TableBodyRow<T>>
        ]) => {
          const isExpanderClick: boolean = this.isExpanderClick(event.targetCell.srcEvent);

          if (!isExpanderClick) return;

          const column: TableColumn = columnIdToColumnMap.get(event.targetCell.columnId);
          const row: TableBodyRow<T> = bodyRowIdToBodyRowMap.get(event.targetCell.rowId);
          const featureOptions: unknown = column.definition.featureOptions;
          const treeDefinition: TableTreeDefinition = hasTreeDefinition(featureOptions) && featureOptions;
          const { modelExpandedKey, modelIdKey } = treeDefinition;
          const nextExtendedState: boolean = !Boolean(row.data[modelExpandedKey]);
          this.eventBus.dispatch(
            new TableFeatureEvents.ExpandRowChanged({
              rowId: row.id,
              rowDataId: row.data[modelIdKey],
              expanded: nextExtendedState,
            })
          );
      });
  }

  private isExpanderClick(event: Event): boolean {
    const eventPath: EventTarget[] = event.composedPath();
    return eventPath.some((eventTarget: HTMLElement) => isTreeExpander(eventTarget));
  }
}
