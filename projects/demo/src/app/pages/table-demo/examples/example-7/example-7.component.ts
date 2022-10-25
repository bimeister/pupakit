import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Uuid } from '@bimeister/pupakit.common';
import { TableColumnDefinition, TableColumnPin, TableController, TableEvents } from '@bimeister/pupakit.table';
import { distinctUntilSerializedChanged, getUuid } from '@bimeister/utilities';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, delay, map, switchMap } from 'rxjs/operators';

interface SomeData {
  id: Uuid;
  firstName: string;
  lastName: string;
  age: number;
}

const BACKEND_DATA: SomeData[] = Array.from({ length: 200 }).map((_value: undefined, index: number) => ({
  id: getUuid(),
  firstName: `Azamat ${index}`,
  lastName: `Aitaliev ${index}`,
  city: 'Moscow',
  age: index + 1,
}));

const COLUMNS: TableColumnDefinition[] = [
  {
    id: 'first-name',
    modelKey: 'firstName',
    title: 'First Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
    type: 'first-name',
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'age-column',
    modelKey: 'age',
    title: 'Age',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 100 },
  },
];

@Component({
  selector: 'demo-table-example-7',
  templateUrl: './example-7.component.html',
  styleUrls: ['./example-7.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample7Component implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  public readonly rowType: SomeData;

  public readonly controller: TableController<SomeData> = new TableController<SomeData>();

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.setBodyInitialCountOfSkeletonRows();

    this.subscription.add(this.processRangeDataChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processRangeDataChanges(): Subscription {
    return this.controller
      .getEvents(TableEvents.ListRangeChanged)
      .pipe(
        debounceTime(500),
        map((event: TableEvents.ListRangeChanged) => event.listRange),
        distinctUntilSerializedChanged(),
        switchMap((listRange: ListRange) => {
          const skip: number = listRange.start;
          const take: number = listRange.end - listRange.start;

          return TableExample7Component.getData(skip, take).pipe(
            map(({ total, list }: { total: number; list: SomeData[] }) => {
              const data: SomeData[] = Array.from({ length: total });
              data.splice(skip, take, ...list);

              return data;
            })
          );
        })
      )
      .subscribe((data: SomeData[]) => this.controller.setData(data));
  }

  private static getData(skip: number, take: number): Observable<{ total: number; list: SomeData[] }> {
    const dataSlice: SomeData[] = BACKEND_DATA.slice(skip, skip + take);
    return of({ total: BACKEND_DATA.length, list: dataSlice }).pipe(delay(800));
  }
}
