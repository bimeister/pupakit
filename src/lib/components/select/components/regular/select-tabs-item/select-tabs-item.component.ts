import { ChangeDetectionStrategy, Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { isEqual } from '@bimeister/utilities/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectTabsService } from '../../../services/select-tabs-state.service';

@Component({
  selector: 'pupa-select-tabs-item',
  templateUrl: './select-tabs-item.component.html',
  styleUrls: ['./select-tabs-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTabsItemComponent<T> {
  @Input() public readonly value: T;

  public readonly isPicked$: Observable<boolean> = this.selectTabsService.currentValue$.pipe(
    map((value: T) => isEqual(value, this.value))
  );

  constructor(private readonly selectTabsService: SelectTabsService<T>) {}

  public processClick(): void {
    this.selectTabsService.currentValue$.next(this.value);
  }

  @HostListener('click', ['$event'])
  @HostListener('touchstart', ['$event'])
  public stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
