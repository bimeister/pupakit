import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { filterNotNil, filterTruthy } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';
import { TabsContainerItem } from '../../../../../internal/declarations/classes/abstract/tabs-container-item.abstract';
import { TabsStateService } from '../../services/tabs-state.service';

@Component({
  selector: 'pupa-tabs-item',
  templateUrl: './tabs-item.component.html',
  styleUrls: ['./tabs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class TabsItemComponent extends TabsContainerItem implements AfterViewInit, OnDestroy {
  @ViewChild('tabItem', { static: false }) public tabItemRef: ElementRef<HTMLElement>;

  private readonly subscription: Subscription = new Subscription();
  constructor(protected readonly tabsStateService: TabsStateService) {
    super(tabsStateService);
  }

  public ngAfterViewInit(): void {
    this.setTabItemClientRectInMap();
    this.subscription.add(this.processActiveValueChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setTabItemClientRectInMap(): void {
    this.value$.pipe(take(1)).subscribe((value: unknown) => {
      const { width, height, top, right, bottom }: ClientRect = this.tabItemRef.nativeElement.getBoundingClientRect();
      const offsetLeft: number = this.tabItemRef.nativeElement.offsetLeft;
      this.tabsStateService.setTabItemClientRectInMap(value, { width, height, top, right, bottom, left: offsetLeft });
    });
  }

  private processActiveValueChanges(): Subscription {
    return this.isActive$
      .pipe(filterNotNil(), filterTruthy(), withLatestFrom(this.value$))
      .subscribe(([_, value]: [boolean, unknown]) => this.tabsStateService.changeActiveTabValueSetByValue(value));
  }
}
