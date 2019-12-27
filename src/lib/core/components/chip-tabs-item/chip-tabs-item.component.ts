import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Host,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { VOID } from './../../../constants/void.const';
import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';
import { ChipTabsComponent } from './../chip-tabs/chip-tabs.component';

@Component({
  selector: 'pupa-chip-tabs-item',
  templateUrl: './chip-tabs-item.component.html',
  styleUrls: ['./chip-tabs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsItemComponent implements OnChanges, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly isActive$: Observable<boolean> = this.chipTabsComponent.selectedTab$.pipe(
    filter((selectedTab: unknown) => !isNullOrUndefined(selectedTab) && selectedTab instanceof ChipTabsItemComponent),
    map((selectedTab: ChipTabsItemComponent) => selectedTab === this),
    distinctUntilChanged()
  );

  @Input() public isActive?: boolean;

  @Output() public readonly activated: EventEmitter<void> = new EventEmitter<void>();

  constructor(@Host() private readonly chipTabsComponent: ChipTabsComponent) {
    this.subscription.add(
      this.isActive$.pipe(filter((isActive: boolean) => isActive)).subscribe(() => this.activated.emit(VOID))
    );
  }

  @HostListener('click')
  public processClickEvent(): void {
    this.selectTab();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (isNullOrUndefined(changes)) {
      return;
    }
    this.processIsActiveValueChnages(changes.isActive);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private selectTab(): void {
    this.chipTabsComponent.selectedTab$.next(this);
  }

  private processIsActiveValueChnages(change: SimpleChange): void {
    if (isNullOrUndefined(change) || isNullOrUndefined(change.currentValue) || !change.currentValue) {
      return;
    }
    this.selectTab();
  }
}
