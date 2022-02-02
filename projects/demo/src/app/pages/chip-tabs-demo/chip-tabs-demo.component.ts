import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Tab } from '@kit/internal/declarations/interfaces/tab.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'demo-chip-tabs-demo',
  templateUrl: './chip-tabs-demo.component.html',
  styleUrls: ['./chip-tabs-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipTabsDemoComponent {
  public readonly tabs: Tab[] = [
    {
      isActive: true,
      value: 'properties',
      name: 'Свойства',
    },
    {
      isActive: false,
      value: 'interfaces',
      name: 'Интерфейсы',
    },
    {
      isActive: false,
      value: 'classes',
      name: 'Классы',
    },
    {
      isActive: false,
      value: 'structures',
      name: 'Структуры',
    },
  ];

  public readonly activeValues$: BehaviorSubject<unknown[]> = new BehaviorSubject<unknown[]>(
    this.tabs.filter(({ isActive }: Tab) => isActive).map(({ value }: Tab) => value)
  );

  public handleTabSelection(values: unknown[]): void {
    this.activeValues$.next(values);
  }

  public tabIsActive(value: unknown, activeValues: unknown[]): boolean {
    return activeValues.includes(value);
  }
}
