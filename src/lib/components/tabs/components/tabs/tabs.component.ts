import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TabsContainer } from '../../../../../internal/declarations/classes/abstract/tabs-container.abstract';
import { TabsStateService } from '../../services/tabs-state.service';

@Component({
  selector: 'pupa-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [TabsStateService]
})
export class TabsComponent extends TabsContainer {
  public readonly activeTabWidthPx$: BehaviorSubject<number> = this.tabsStateService.activeTabWidthPx$;
  public readonly activeTabTranslateX$: Observable<string> = this.tabsStateService.activeTabTranslateX$;

  constructor(protected readonly tabsStateService: TabsStateService) {
    super(tabsStateService);
  }
}
