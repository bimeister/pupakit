import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { take } from 'rxjs/operators';
import { TabsContainerItem } from '../../../../../internal/declarations/classes/abstract/tabs-container-item.abstract';
import { TabsStateService } from '../../services/tabs-state.service';

@Component({
  selector: 'pupa-tabs-item',
  templateUrl: './tabs-item.component.html',
  styleUrls: ['./tabs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class TabsItemComponent extends TabsContainerItem implements AfterViewInit {
  @ViewChild('tabItem', { static: false }) public tabItemRef: ElementRef<HTMLElement>;

  constructor(protected readonly tabsStateService: TabsStateService) {
    super(tabsStateService);
  }

  public ngAfterViewInit(): void {
    this.setTabItemClientRectInMap();
  }

  private setTabItemClientRectInMap(): void {
    this.value$.pipe(take(1)).subscribe((value: unknown) => {
      const { width, height, top, right, bottom }: ClientRect = this.tabItemRef.nativeElement.getBoundingClientRect();
      const offsetLeft: number = this.tabItemRef.nativeElement.offsetLeft;
      this.tabsStateService.setTabItemClientRectInMap(value, { width, height, top, right, bottom, left: offsetLeft });
    });
  }
}
