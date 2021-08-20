import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { isEmpty, Nullable, shareReplayWithRefCount, stringFilterPredicate } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridStateService } from '../../src/lib/components/layout/services/grid-state.service';

interface LinkItem {
  title: string;
  link: string;
}

interface LinksGroup {
  title: string;
  linkItems: LinkItem[];
}

@Component({
  selector: 'demo-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent implements OnDestroy {
  public readonly isNavigationVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly gridVisibleFormControl: FormControl = new FormControl(false);

  private readonly generalGroup: LinksGroup = {
    title: 'General',
    linkItems: [
      { title: 'Typography', link: './typography' },
      { title: 'Colors', link: './colors' },
      { title: 'Icon', link: './icon' },
      { title: 'Button & Button Icon & Button Round', link: './button' },
      { title: 'Avatar', link: './avatar' }
    ]
  };

  private readonly dataEntryGroup: LinksGroup = {
    title: 'Data Entry',
    linkItems: [
      { title: 'Checkbox', link: './checkbox' },
      { title: 'Switcher', link: './switcher' },
      { title: 'Date time pickers', link: './date-time-picker' },
      { title: 'Input', link: './input' },
      { title: 'Table Input', link: './table-input' },
      { title: 'Search Field', link: './search-field' },
      { title: '⚠️ Textarea', link: './textarea' },
      { title: 'Radio buttons', link: './radio' },
      { title: 'Rating', link: './rating' },
      { title: '⚠️ Select', link: './select' },
      { title: 'Selector', link: './selector' },
      { title: '⚠️ Uploads', link: './uploads' }
    ]
  };

  private readonly dataDisplayGroup: LinksGroup = {
    title: 'Data Display',
    linkItems: [
      { title: 'Datagrid', link: './datagrid' },
      { title: 'Tree', link: './tree' },
      { title: 'Tree (new)', link: './tree-new' },
      { title: 'Tooltip', link: './tooltip' },
      { title: 'Tabs', link: './tabs' },
      { title: 'Vertical Tabs', link: './vertical-tabs' },
      { title: 'Chip Tabs', link: './chip-tabs' },
      { title: 'Chip', link: './chip' },
      { title: 'Chip button', link: './chip-button' },
      { title: 'Paged Virtual Scroll', link: './paged-virtual-scroll' }
    ]
  };

  private readonly feedbackGroup: LinksGroup = {
    title: 'Feedback',
    linkItems: [
      { title: 'Drawer', link: './drawer' },
      { title: 'Modal', link: './modal' },
      { title: 'Spinner & loader', link: './spinner' }
    ]
  };

  private readonly otherGroup: LinksGroup = {
    title: 'Other',
    linkItems: [
      { title: 'Tile', link: './tile' },
      { title: '⚠️ Draggable', link: './draggable' },
      { title: '⚠️ Droppable', link: './droppable' },
      { title: '⚠️ Dropdown', link: './dropdown' },
      { title: '⚠️ Dropdown menu', link: './dropdown-menu' },
      { title: 'Layout', link: './layout' },
      { title: 'Controls isPatched', link: './controls-is-patched' }
    ]
  };

  private readonly deprecatedGroup: LinksGroup = {
    title: 'Deprecated, unused, useless',
    linkItems: [
      { title: '⚠️ Icon button', link: './icon-button' },
      { title: 'Draggable list', link: './draggable-list' },
      { title: 'Multiselection list', link: './multiselection-list' },
      { title: 'Select Multiple', link: './select-multiple' },
      { title: 'Day selector', link: './day-selector' },
      { title: 'Time input', link: './time-input' },
      { title: 'Scrollbar', link: './scrollbar' }
    ]
  };

  private readonly linkGroups: LinksGroup[] = [
    this.generalGroup,
    this.dataEntryGroup,
    this.dataDisplayGroup,
    this.feedbackGroup,
    this.otherGroup,
    this.deprecatedGroup
  ];

  private readonly searchValue$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);
  public filteredLinkGroups$: Observable<LinksGroup[]> = this.searchValue$.pipe(
    map((searchValue: string) => {
      if (isEmpty(searchValue)) {
        return this.linkGroups;
      }

      return this.linkGroups.reduce((filteredGroups: LinksGroup[], group: LinksGroup) => {
        const filteredLinks: LinkItem[] = group.linkItems.filter((linkItem: LinkItem) =>
          stringFilterPredicate(linkItem.title, searchValue)
        );

        if (isEmpty(filteredLinks)) {
          return filteredGroups;
        }

        filteredGroups.push({
          ...group,
          linkItems: filteredLinks
        });

        return filteredGroups;
      }, []);
    }),
    shareReplayWithRefCount()
  );

  public isEmpty$: Observable<boolean> = this.filteredLinkGroups$.pipe(
    map((filteredLinkGroups: LinksGroup[]) => isEmpty(filteredLinkGroups))
  );

  public searchFieldContainerAdditionaslClassName$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private readonly subscription: Subscription = new Subscription();
  constructor(private readonly gridStateService: GridStateService) {
    this.subscription.add(this.processGridVisibleStateControlChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setSearchValue(searchValue: string): void {
    this.searchValue$.next(searchValue);
  }

  public processItemsScroll(event: Event): void {
    const target: EventTarget = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const scrollTop: number = target.scrollTop;

    if (scrollTop > 0) {
      this.searchFieldContainerAdditionaslClassName$.next('with-shadow');
      return;
    }

    this.searchFieldContainerAdditionaslClassName$.next('');
  }

  public showNavigationContainer(): void {
    this.isNavigationVisible$.next(true);
  }

  public hideNavigationContainer(): void {
    this.isNavigationVisible$.next(false);
  }

  private processGridVisibleStateControlChanges(): Subscription {
    return this.gridVisibleFormControl.valueChanges.subscribe(() => this.gridStateService.toggleGridVisibleState());
  }
}
